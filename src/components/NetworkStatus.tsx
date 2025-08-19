import React from 'react';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface NetworkStatusProps {
  networkSupported: boolean;
  currentNetwork: any;
  onSwitchNetwork: () => Promise<boolean>;
  loading: boolean;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({
  networkSupported,
  currentNetwork,
  onSwitchNetwork,
  loading
}) => {
  if (networkSupported) {
    return (
      <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
        <CheckCircle className="w-4 h-4 text-green-400" />
        <span className="text-sm text-green-300">
          Connected to {currentNetwork?.name || 'Lisk Network'}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-300 mb-1">
            Network Not Supported
          </h3>
          <p className="text-sm text-yellow-200 mb-3">
            This app requires Lisk Network. You're currently connected to{' '}
            {currentNetwork?.name || 'an unsupported network'}.
          </p>
          <button
            onClick={onSwitchNetwork}
            disabled={loading}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-700 text-black font-medium px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Switching...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Switch to Lisk Network</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};