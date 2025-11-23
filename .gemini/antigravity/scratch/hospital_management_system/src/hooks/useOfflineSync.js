import { useState, useEffect } from 'react';
import offlineManager from '../utils/offlineManager';

/**
 * Custom hook for managing offline sync operations
 * @returns {Object} Offline sync state and methods
 */
export const useOfflineSync = () => {
    const [isOnline, setIsOnline] = useState(offlineManager.isOnline());
    const [pendingCount, setPendingCount] = useState(offlineManager.getPendingCount());
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState(null);

    useEffect(() => {
        //Subscribe to online/offline status changes
        const unsubscribe = offlineManager.addListener((online) => {
            setIsOnline(online);
            updatePendingCount();
        });

        // Initial update
        updatePendingCount();

        return unsubscribe;
    }, []);

    const updatePendingCount = () => {
        setPendingCount(offlineManager.getPendingCount());
    };

    const syncNow = async () => {
        if (!isOnline || isSyncing) return;

        setIsSyncing(true);
        try {
            const result = await offlineManager.manualSync();
            setLastSyncTime(new Date());
            updatePendingCount();
            return result;
        } catch (error) {
            console.error('[useOfflineSync] Sync failed:', error);
            throw error;
        } finally {
            setIsSyncing(false);
        }
    };

    const queueOperation = (operation) => {
        const id = offlineManager.queueOperation(operation);
        updatePendingCount();
        return id;
    };

    return {
        isOnline,
        pendingCount,
        isSyncing,
        lastSyncTime,
        syncNow,
        queueOperation
    };
};

export default useOfflineSync;
