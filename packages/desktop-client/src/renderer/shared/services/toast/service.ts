import type { INotificationService } from "@renderer/shared/types/interface";
import { PrimeToast } from "./singleton";
import { ToastSeverity } from "@shared/enum/enum";

export class ToastNotificationService implements INotificationService {
  show(severity: ToastSeverity, detail: string) {
    const summary =
      severity === ToastSeverity.SUCCESS
        ? "Success"
        : severity === ToastSeverity.ERROR
          ? "Error"
          : severity === ToastSeverity.WARN
            ? "Warning"
            : "Info";

    PrimeToast.show({
      severity: severity,
      summary,
      detail,
      life: 3000,
    });
  }
}

export const toastService = new ToastNotificationService();
