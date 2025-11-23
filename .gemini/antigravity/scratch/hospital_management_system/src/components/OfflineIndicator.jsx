import React from 'react';
import { WifiOff, Wifi, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useOfflineSync } from '../hooks/useOfflineSync';

const OfflineIndicator = () => {
    const { isOnline, pendingCount, isSyncing, lastSyncTime, syncNow } = useOfflineSync();
    const [showSyncSuccess, setShowSyncSuccess] = React.useState(false);
    const [syncError, setSyncError] = React.useState(null);

    const handleSync = async () => {
        try {
            setSyncError(null);
            const result = await syncNow();

            if (result.success) {
                setShowSyncSuccess(true);
                setTimeout(() => setShowSyncSuccess(false), 3000);
            }

            if (result.errors && result.errors.length > 0) {
                setSyncError(`${result.errors.length} operations failed to sync`);
            }
        } catch (error) {
            setSyncError('Sync failed. Please try again.');
        }
    };

    // Don't show anything if online and no pending operations
    if (isOnline && pendingCount === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-fade-in">
            <div
                className={`rounded-xl shadow-2xl border-2 p-4 backdrop-blur-sm ${isOnline
                        ? 'bg-emerald-50/95 border-emerald-200'
                        : 'bg-amber-50/95 border-amber-200'
                    }`}
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div
                            className={`p-2 rounded-lg ${isOnline ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}
                        >
                            {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
                        </div>
                        <div>
                            <p
                                className={`font-bold text-sm ${isOnline ? 'text-emerald-800' : 'text-amber-800'
                                    }`}
                            >
                                {isOnline ? 'Online' : 'Offline Mode'}
                            </p>
                            <p className="text-xs text-slate-600">
                                {pendingCount > 0
                                    ? `${pendingCount} operation${pendingCount > 1 ? 's' : ''} pending`
                                    : isOnline
                                        ? 'All synced'
                                        : 'Changes will sync when online'}
                            </p>
                        </div>
                    </div>

                    {isOnline && pendingCount > 0 && (
                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className={`p-2 rounded-lg transition-all ${isSyncing
                                    ? 'bg-emerald-100 text-emerald-400 cursor-not-allowed'
                                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg'
                                }`}
                            title="Sync now"
                        >
                            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
                        </button>
                    )}
                </div>

                {/* Sync Success Message */}
                {showSyncSuccess && (
                    <div className="mt-3 flex items-center gap-2 p-2 bg-emerald-100 rounded-lg">
                        <Check size={16} className="text-emerald-600" />
                        <p className="text-xs font-medium text-emerald-800">
                            Successfully synced {pendingCount} operation{pendingCount > 1 ? 's' : ''}
                        </p>
                    </div>
                )}

                {/* Sync Error Message */}
                {syncError && (
                    <div className="mt-3 flex items-center gap-2 p-2 bg-red-100 rounded-lg">
                        <AlertCircle size={16} className="text-red-600" />
                        <p className="text-xs font-medium text-red-800">{syncError}</p>
                    </div>
                )}

                {/* Last Sync Time */}
                {lastSyncTime && isOnline && (
                    <p className="text-xs text-slate-500 mt-2 text-right">
                        Last synced: {lastSyncTime.toLocaleTimeString()}
                    </p>
                )}
            </div>
        </div>
    );
};

export default OfflineIndicator;
