import type { INotificationService } from '@renderer/shared/types/interface';
import { toast } from "react-toastify";
import { ToastSeverity } from '@shared/enum/enum';

export class ToastNotificationService implements INotificationService {
  show(
    severity: ToastSeverity,
    detail: string
  ) {
    const type = severity;
    const message = detail;

    if (typeof toast[type] === "function") {
      toast[type](message);
    } else {
      toast(message);
    }
  }
}

export const toastService = new ToastNotificationService();
