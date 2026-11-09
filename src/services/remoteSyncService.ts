import type {
  DashboardStateSnapshot,
  HubMessage,
  RemoteCommand,
} from '../types/remote';

type CommandListener = (command: RemoteCommand) => void;
type CountListener = (count: number) => void;

class RemoteSyncService {
  private ws: WebSocket | null = null;
  private commandListeners: Set<CommandListener> = new Set();
  private countListeners: Set<CountListener> = new Set();
  private reconnectTimer: any = null;
  private isConnecting = false;
  private lastStateSnapshot: Partial<DashboardStateSnapshot> | null = null;
  public connectedRemotesCount = 0;

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isConnecting = true;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws?role=dashboard`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnecting = false;
        // Resend last known state on reconnection if available
        if (this.lastStateSnapshot) {
          this.broadcastState(this.lastStateSnapshot);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const msg: HubMessage = JSON.parse(event.data);
          if (msg.type === 'COMMAND') {
            for (const listener of this.commandListeners) {
              listener(msg.command);
            }
          } else if (msg.type === 'CLIENT_COUNT') {
            this.connectedRemotesCount = msg.count;
            for (const listener of this.countListeners) {
              listener(msg.count);
            }
          }
        } catch (e) {
          console.error('[RemoteSync] Failed to parse message:', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        this.ws = null;
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn('[RemoteSync] WebSocket error:', err);
        if (this.ws) {
          this.ws.close();
        }
      };
    } catch (e) {
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 3000);
  }

  onCommand(listener: CommandListener): () => void {
    this.commandListeners.add(listener);
    return () => {
      this.commandListeners.delete(listener);
    };
  }

  onRemotesCountChange(listener: CountListener): () => void {
    this.countListeners.add(listener);
    listener(this.connectedRemotesCount);
    return () => {
      this.countListeners.delete(listener);
    };
  }

  broadcastState(state: Partial<DashboardStateSnapshot>) {
    this.lastStateSnapshot = { ...this.lastStateSnapshot, ...state };
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg: HubMessage = {
        type: 'STATE_UPDATE',
        state,
      };
      this.ws.send(JSON.stringify(msg));
    }
  }
}

export const remoteSyncService = new RemoteSyncService();
