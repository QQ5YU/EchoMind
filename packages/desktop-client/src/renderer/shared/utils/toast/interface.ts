import { ToastSeverity } from "@renderer/shared/config";

export interface INotificationService {
  show(severity: ToastSeverity, detail: string): void;
}