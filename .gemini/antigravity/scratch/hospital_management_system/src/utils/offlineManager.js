// Offline Manager - Handles offline detection and operation queuing

class OfflineManager {
    constructor() {
        this.isOnlineStatus = navigator.onLine;
        this.syncQueue = this.loadQueue();
        this.listeners = [];

        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    // Check if currently online
    isOnline() {
        return this.isOnlineStatus;
    }

    // Add listener for status changes
    addListener(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    // Notify all listeners
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.isOnlineStatus));
    }

    // Handle going online
    handleOnline() {
        console.log('[OfflineManager] Connection restored');
        this.isOnlineStatus = true;
        this.notifyListeners();
        this.syncPendingOperations();
    }

    // Handle going offline
    handleOffline() {
        console.log('[OfflineManager] Connection lost');
        this.isOnlineStatus = false;
        this.notifyListeners();
    }

    // Queue an operation to be synced later
    queueOperation(operation) {
        const queueItem = {
            id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            operation,
            status: 'pending'
        };

        this.syncQueue.push(queueItem);
        this.saveQueue();

        console.log('[OfflineManager] Operation queued:', queueItem.id);

        // Try to sync immediately if online
        if (this.isOnline()) {
            this.syncPendingOperations();
        }

        return queueItem.id;
    }

    // Get pending operations count
    getPendingCount() {
        return this.syncQueue.filter(item => item.status === 'pending').length;
    }

    // Get all pending operations
    getPendingOperations() {
        return this.syncQueue.filter(item => item.status === 'pending');
    }

    // Sync all pending operations
    async syncPendingOperations() {
        if (!this.isOnline()) {
            console.log('[OfflineManager] Cannot sync - offline');
            return { success: false, reason: 'offline' };
        }

        const pendingOps = this.getPendingOperations();

        if (pendingOps.length === 0) {
            console.log('[OfflineManager] No pending operations to sync');
            return { success: true, synced: 0 };
        }

        console.log(`[OfflineManager] Syncing ${pendingOps.length} operations...`);

        let syncedCount = 0;
        const errors = [];

        for (const item of pendingOps) {
            try {
                // Execute the operation
                await this.executeOperation(item.operation);

                // Mark as synced
                item.status = 'synced';
                item.syncedAt = new Date().toISOString();
                syncedCount++;

                console.log('[OfflineManager] Synced operation:', item.id);
            } catch (error) {
                console.error('[OfflineManager] Failed to sync operation:', item.id, error);
                item.status = 'error';
                item.error = error.message;
                errors.push({ id: item.id, error: error.message });
            }
        }

        // Save updated queue
        this.saveQueue();

        // Clean up old synced operations (keep last 50)
        this.cleanupQueue();

        console.log(`[OfflineManager] Sync complete: ${syncedCount} synced, ${errors.length} errors`);

        return {
            success: true,
            synced: syncedCount,
            errors: errors.length > 0 ? errors : undefined
        };
    }

    // Execute a single operation
    async executeOperation(operation) {
        // Operations are just data state changes that get applied to DataContext
        // The actual execution happens in the component/context that queued it
        // This is just a placeholder - real implementation would trigger callbacks

        if (operation.callback && typeof operation.callback === 'function') {
            return operation.callback();
        }

        // For now, we just resolve - the data is already in localStorage
        return Promise.resolve();
    }

    // Load queue from localStorage
    loadQueue() {
        try {
            const stored = localStorage.getItem('hms_sync_queue');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('[OfflineManager] Failed to load queue:', error);
            return [];
        }
    }

    // Save queue to localStorage
    saveQueue() {
        try {
            localStorage.setItem('hms_sync_queue', JSON.stringify(this.syncQueue));
        } catch (error) {
            console.error('[OfflineManager] Failed to save queue:', error);
        }
    }

    // Clean up old synced operations
    cleanupQueue() {
        const syncedOps = this.syncQueue.filter(item => item.status === 'synced');

        if (syncedOps.length > 50) {
            // Keep only the 50 most recent synced operations
            const toKeep = syncedOps
                .sort((a, b) => new Date(b.syncedAt) - new Date(a.syncedAt))
                .slice(0, 50)
                .map(op => op.id);

            this.syncQueue = this.syncQueue.filter(
                item => item.status !== 'synced' || toKeep.includes(item.id)
            );

            this.saveQueue();
        }
    }

    // Clear all operations
    clearQueue() {
        this.syncQueue = [];
        this.saveQueue();
        console.log('[OfflineManager] Queue cleared');
    }

    // Manual sync trigger
    async manualSync() {
        console.log('[OfflineManager] Manual sync triggered');
        return this.syncPendingOperations();
    }
}

// Create singleton instance
const offlineManager = new OfflineManager();

export default offlineManager;
