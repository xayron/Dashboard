import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  DashboardStateSnapshot,
  HubMessage,
  RemoteCommand,
} from '../types/remote';

const DEFAULT_STATE: DashboardStateSnapshot = {
  activeMode: 'ambient',
  autoCalculatedMode: 'ambient',
  manualOverrideMode: null,
  isRaceWeekendSimulated: false,
  theme: 'obsidian',
  uiStyle: 'modern',
  colorMode: 'dark',
  settingsLayout: 'drawer',
  isKioskBarVisible: true,
  isSettingsOpen: false,
  f1ActiveWidgets: ['countdown', 'podium', 'titleBattle'],
  f1AutoFit: true,
  media: {
    title: 'No media playing',
    artist: 'Idle',
    album: '',
    entityId: '',
    state: 'idle',
    volume: 0.5,
    position: 0,
    duration: 0,
  },
  weather: {
    temperature: 24,
    condition: 'Clear',
    humidity: 45,
    windSpeed: 8,
    highTemp: 28,
    lowTemp: 18,
    rainProbability: 0,
  },
  tasks: [],
  systemHealth: {
    haConnected: false,
    haStatus: 'disconnected',
    networkLatencyMs: 0,
    lastHeartbeat: new Date().toISOString(),
  },
  connectedRemotesCount: 1,
};

export function useRemoteSocket() {
  const [state, setState] = useState<DashboardStateSnapshot>(DEFAULT_STATE);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setConnectionStatus('connecting');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws?role=remote`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const msg: HubMessage = JSON.parse(event.data);
          if (msg.type === 'STATE_UPDATE') {
            setState((prev) => ({
              ...prev,
              ...msg.state,
              media: { ...prev.media, ...(msg.state.media || {}) },
              weather: { ...prev.weather, ...(msg.state.weather || {}) },
              systemHealth: { ...prev.systemHealth, ...(msg.state.systemHealth || {}) },
            }));
          }
        } catch (e) {
          console.error('[RemoteSocket] Parse error:', e);
        }
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        wsRef.current = null;
        scheduleReconnect();
      };

      ws.onerror = () => {
        setConnectionStatus('disconnected');
        if (wsRef.current) wsRef.current.close();
      };
    } catch (e) {
      setConnectionStatus('disconnected');
      scheduleReconnect();
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) return;
    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectTimeoutRef.current = null;
      connect();
    }, 2000);
  }, [connect]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  const sendCommand = useCallback((cmd: RemoteCommand) => {
    // Provide subtle haptic feedback if available on device
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (e) {}
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(cmd));
    } else {
      console.warn('[RemoteSocket] Cannot send command, WebSocket is not open');
    }
  }, []);

  return {
    state,
    connectionStatus,
    sendCommand,
  };
}
