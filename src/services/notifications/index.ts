import { INotificationService } from './types';
import { LocalNotificationService } from './localNotificationService';
import { SupabaseNotificationService } from './supabaseNotificationService';
import { isSupabaseConfigured } from '../supabaseClient';

function createNotificationService(): INotificationService {
  if (isSupabaseConfigured()) {
    return new SupabaseNotificationService();
  }
  return new LocalNotificationService();
}

export const notificationService: INotificationService = createNotificationService();

export * from './types';
export * from './localNotificationService';
export * from './supabaseNotificationService';
