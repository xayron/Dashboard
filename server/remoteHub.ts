import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin, ViteDevServer, PreviewServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import type {
  DashboardStateSnapshot,
  HubMessage,
  RemoteCommand,
} from '../src/types/remote';

export function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  // Prefer standard Wi-Fi or Ethernet interfaces
  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (!ifaceList) continue;
    for (const iface of ifaceList) {
      if (iface.family === 'IPv4' && !iface.internal) {
        // Return first non-internal IPv4
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

export function remoteHubPlugin(): Plugin {
  let wss: WebSocketServer | null = null;
  let currentHttpServer: any = null;
  const dashboardClients = new Set<WebSocket>();
  const remoteClients = new Set<WebSocket>();

  let cachedState: Partial<DashboardStateSnapshot> = {
    activeMode: 'ambient',
    autoCalculatedMode: 'ambient',
    manualOverrideMode: null,
    isRaceWeekendSimulated: false,
    theme: 'obsidian',
    uiStyle: 'modern',
    colorMode: 'dark',
    settingsLayout: 'drawer',
    isKioskBarVisible: false,
    isSettingsOpen: false,
    f1ActiveWidgets: ['countdown', 'podium', 'titleBattle'],
    f1AutoFit: true,
  };

  const broadcastToRemotes = (msg: HubMessage) => {
    const data = JSON.stringify(msg);
    for (const client of remoteClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  };

  const broadcastToDashboard = (msg: HubMessage) => {
    const data = JSON.stringify(msg);
    for (const client of dashboardClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  };

  const notifyCounts = () => {
    const countMsg: HubMessage = {
      type: 'CLIENT_COUNT',
      count: remoteClients.size,
    };
    broadcastToDashboard(countMsg);
  };

  const executeDpms = (action: 'sleep' | 'wake' | 'status'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const scriptPath = path.resolve(process.cwd(), 'scripts/manage-dpms.sh');
      if (!fs.existsSync(scriptPath)) {
        return resolve(`manage-dpms.sh not found at ${scriptPath}`);
      }
      execFile('bash', [scriptPath, action], (err, stdout, stderr) => {
        if (err) {
          return resolve(`DPMS command executed (code ${err.code}): ${stdout || stderr}`);
        }
        resolve(stdout || stderr || 'OK');
      });
    });
  };

  const setupWebSocket = (httpServer: any) => {
    currentHttpServer = httpServer;
    if (wss || !httpServer) return;

    wss = new WebSocketServer({ noServer: true });

    httpServer.on('upgrade', (req: IncomingMessage, socket: any, head: any) => {
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      if (url.pathname === '/ws') {
        wss!.handleUpgrade(req, socket, head, (ws) => {
          wss!.emit('connection', ws, req);
        });
      }
    });

    wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const role = url.searchParams.get('role') || 'remote';

      if (role === 'dashboard') {
        dashboardClients.add(ws);
        notifyCounts();

        ws.on('message', (raw) => {
          try {
            const data: HubMessage = JSON.parse(raw.toString());
            if (data.type === 'STATE_UPDATE') {
              cachedState = { ...cachedState, ...data.state };
              broadcastToRemotes(data);
            }
          } catch (e) {
            console.error('[RemoteHub] Error parsing dashboard message:', e);
          }
        });

        ws.on('close', () => {
          dashboardClients.delete(ws);
        });
      } else {
        // remote client
        remoteClients.add(ws);
        notifyCounts();

        // Immediately sync current cached state to this remote
        if (ws.readyState === WebSocket.OPEN) {
          const syncMsg: HubMessage = {
            type: 'STATE_UPDATE',
            state: {
              ...cachedState,
              connectedRemotesCount: remoteClients.size,
            },
          };
          ws.send(JSON.stringify(syncMsg));
        }

        ws.on('message', async (raw) => {
          try {
            const cmd: RemoteCommand = JSON.parse(raw.toString());

            // Handle system commands directly on host if requested
            if (cmd.type === 'SYSTEM_COMMAND') {
              if (cmd.command === 'dpms_sleep') {
                await executeDpms('sleep');
              } else if (cmd.command === 'dpms_wake') {
                await executeDpms('wake');
              }
            }

            // Relay command to dashboard
            const cmdMsg: HubMessage = {
              type: 'COMMAND',
              command: cmd,
            };
            broadcastToDashboard(cmdMsg);
          } catch (e) {
            console.error('[RemoteHub] Error handling remote command:', e);
          }
        });

        ws.on('close', () => {
          remoteClients.delete(ws);
          notifyCounts();
        });
      }
    });
  };

  const handleHttpApi = (req: IncomingMessage, res: ServerResponse, next?: () => void) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);

    if (url.pathname === '/api/network-info') {
      const ip = getLocalIpAddress();
      let port = 3000;
      const addr = currentHttpServer?.address();
      if (addr && typeof addr === 'object' && addr.port) {
        port = addr.port;
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          ip,
          port,
          remoteUrl: `http://${ip}:${port}/remote`,
          connectedRemotesCount: remoteClients.size,
          hostname: os.hostname(),
        })
      );
      return;
    }

    if (url.pathname === '/api/system/dpms') {
      const action = (url.searchParams.get('action') as 'sleep' | 'wake' | 'status') || 'status';
      executeDpms(action).then((output) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, action, output }));
      }).catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: String(err) }));
      });
      return;
    }

    if (url.pathname === '/api/remote/state') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(cachedState));
      return;
    }

    if (next) next();
  };

  return {
    name: 'remote-hub-server',
    configureServer(server: ViteDevServer) {
      setupWebSocket(server.httpServer);
      server.middlewares.use((req, res, next) => {
        handleHttpApi(req, res, next);
      });
    },
    configurePreviewServer(server: PreviewServer) {
      setupWebSocket(server.httpServer);
      server.middlewares.use((req, res, next) => {
        handleHttpApi(req, res, next);
      });
    },
  };
}
