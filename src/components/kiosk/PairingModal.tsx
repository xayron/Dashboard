import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Smartphone,
  Wifi,
  ExternalLink,
  Check,
  Copy,
  Radio,
  Sparkles,
} from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';

interface NetworkInfo {
  ip: string;
  port: number;
  remoteUrl: string;
  connectedRemotesCount: number;
  hostname: string;
}

export const PairingModal: React.FC = () => {
  const { isPairingModalOpen, setIsPairingModalOpen, connectedRemotesCount } = useDashboard();
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isPairingModalOpen) return;

    let mounted = true;
    setLoading(true);

    fetch('/api/network-info')
      .then(res => res.json())
      .then(async (data: NetworkInfo) => {
        if (!mounted) return;
        setNetworkInfo(data);
        try {
          const qr = await QRCode.toDataURL(data.remoteUrl, {
            width: 256,
            margin: 2,
            color: {
              dark: '#0f172a',
              light: '#ffffff',
            },
          });
          if (mounted) {
            setQrDataUrl(qr);
            setLoading(false);
          }
        } catch (e) {
          console.error('[PairingModal] Failed to generate QR code:', e);
          if (mounted) setLoading(false);
        }
      })
      .catch(err => {
        console.error('[PairingModal] Failed to fetch network info:', err);
        // Fallback to current browser location
        const fallbackUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port || 3000}/remote`;
        const fallbackInfo: NetworkInfo = {
          ip: window.location.hostname,
          port: Number(window.location.port) || 3000,
          remoteUrl: fallbackUrl,
          connectedRemotesCount: 0,
          hostname: 'smart-display',
        };
        if (mounted) {
          setNetworkInfo(fallbackInfo);
          QRCode.toDataURL(fallbackUrl, { width: 256, margin: 2 }).then(qr => {
            if (mounted) {
              setQrDataUrl(qr);
              setLoading(false);
            }
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, [isPairingModalOpen]);

  if (!isPairingModalOpen) return null;

  const handleCopy = () => {
    if (networkInfo?.remoteUrl) {
      navigator.clipboard.writeText(networkInfo.remoteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-slate-900 border border-white/15 rounded-3xl shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Smartphone size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Connect Phone Controller</h3>
              <p className="text-xs text-gray-400">Control this dashboard from any mobile device</p>
            </div>
          </div>
          <button
            onClick={() => setIsPairingModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live status badge */}
        <div className="mt-4 flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs">
          <div className="flex items-center space-x-2">
            <Radio
              size={14}
              className={connectedRemotesCount > 0 ? 'text-emerald-400 animate-pulse' : 'text-gray-400'}
            />
            <span className="font-medium">
              {connectedRemotesCount > 0
                ? `${connectedRemotesCount} Phone${connectedRemotesCount > 1 ? 's' : ''} Connected`
                : 'Waiting for phone to connect...'}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-gray-400">
            <Wifi size={13} />
            <span>Local Wi-Fi</span>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="my-5 flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10">
          {loading ? (
            <div className="w-56 h-56 flex items-center justify-center text-gray-400 text-sm">
              <span className="animate-pulse">Generating QR code...</span>
            </div>
          ) : qrDataUrl ? (
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <img src={qrDataUrl} alt="Remote QR Code" className="w-48 h-48 block" />
            </div>
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-red-400 text-sm">
              Failed to generate QR
            </div>
          )}
          <span className="mt-3 text-xs text-gray-400 flex items-center space-x-1">
            <Sparkles size={12} className="text-amber-400" />
            <span>Scan with your phone camera to open</span>
          </span>
        </div>

        {/* Direct Link box */}
        <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-white/10 text-xs font-mono">
          <span className="truncate select-all text-blue-300 pr-2">
            {networkInfo?.remoteUrl || 'http://localhost:3000/remote'}
          </span>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition flex items-center space-x-1 shrink-0"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-gray-400 space-y-1">
          <p className="font-semibold text-gray-300">Quick Tips:</p>
          <p>• Make sure your phone is connected to the same Wi-Fi network.</p>
          <p>• In Safari/Chrome on your phone, tap <span className="text-gray-200">"Add to Home Screen"</span> for a full-screen app experience.</p>
        </div>
      </div>
    </div>
  );
};
