import { INotificationService } from './types';
import { SupabaseNotificationService } from './supabaseNotificationService';

export const notificationService: INotificationService = new SupabaseNotificationService();

export * from './types';
export * from './supabaseNotificationService';
