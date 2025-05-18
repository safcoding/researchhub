'use client';

import { useEffect } from 'react';
import { initializeStorage } from '@/utils/init-storage';

export function StorageInitializer() {
  useEffect(() => {
    // Only run once on client side when the app starts
    if (typeof window !== 'undefined') {
      const init = async () => {
        try {
          console.log('StorageInitializer: Initializing storage...');
          const success = await initializeStorage();
          console.log('StorageInitializer: Initialization completed, success:', success);
        } catch (err) {
          console.error('StorageInitializer: Error initializing storage:', err);
        }
      };
      
      void init();
    }
  }, []);

  // This component doesn't render anything visible
  return null;
}
