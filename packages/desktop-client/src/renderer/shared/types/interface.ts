import { ToastSeverity } from '@shared/enum/enum';

export interface INotificationService {
  show(severity: ToastSeverity, detail: string): void;
}