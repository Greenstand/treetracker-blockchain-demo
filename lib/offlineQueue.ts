import { OfflineQueueItem } from '@/types';

const QUEUE_STORAGE_KEY = 'treetracker_offline_queue';

class OfflineQueueManager {
  private queue: OfflineQueueItem[] = [];
  private isOnline: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadQueue();
      this.setupOnlineListener();
    }
  }

  // Load queue from localStorage
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }

  // Save queue to localStorage
  private saveQueue(): void {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }

  // Setup online/offline event listeners
  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    this.isOnline = navigator.onLine;
  }

  // Add item to queue
  addToQueue(type: OfflineQueueItem['type'], data: any): string {
    const item: OfflineQueueItem = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date(),
      retryCount: 0,
    };

    this.queue.push(item);
    this.saveQueue();

    // Try to process immediately if online
    if (this.isOnline) {
      this.processQueue();
    }

    return item.id;
  }

  // Get all queued items
  getQueue(): OfflineQueueItem[] {
    return [...this.queue];
  }

  // Get queue count
  getQueueCount(): number {
    return this.queue.length;
  }

  // Remove item from queue
  removeFromQueue(itemId: string): void {
    this.queue = this.queue.filter(item => item.id !== itemId);
    this.saveQueue();
  }

  // Clear entire queue
  clearQueue(): void {
    this.queue = [];
    this.saveQueue();
  }

  // Process queue (upload pending items)
  async processQueue(): Promise<void> {
    if (!this.isOnline || this.queue.length === 0) {
      return;
    }

    console.log(`Processing ${this.queue.length} queued items...`);

    const itemsToProcess = [...this.queue];

    for (const item of itemsToProcess) {
      try {
        await this.processQueueItem(item);
        this.removeFromQueue(item.id);
        console.log(`Successfully processed queue item: ${item.id}`);
      } catch (error) {
        console.error(`Failed to process queue item: ${item.id}`, error);
        
        // Update retry count
        const queueItem = this.queue.find(q => q.id === item.id);
        if (queueItem) {
          queueItem.retryCount++;
          queueItem.lastAttempt = new Date();
          
          // Remove if too many retries
          if (queueItem.retryCount >= 5) {
            console.error(`Max retries reached for item: ${item.id}`);
            this.removeFromQueue(item.id);
          } else {
            this.saveQueue();
          }
        }
      }
    }
  }

  // Process individual queue item
  private async processQueueItem(item: OfflineQueueItem): Promise<void> {
    // Import API service dynamically to avoid circular dependencies
    const { api } = await import('./api');

    switch (item.type) {
      case 'capture':
        await api.submitTreeCapture(item.data);
        break;
      case 'profile_update':
        await api.updateProfile(item.data.userId, item.data.updates);
        break;
      case 'follow_up':
        await api.submitTreeCapture(item.data);
        break;
      default:
        throw new Error(`Unknown queue item type: ${item.type}`);
    }
  }

  // Check if online
  isDeviceOnline(): boolean {
    return this.isOnline;
  }
}

// Export singleton instance
export const offlineQueue = new OfflineQueueManager();