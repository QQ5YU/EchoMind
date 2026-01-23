import { ToastSeverity } from "@renderer/shared/config";
import { INotificationService } from "./interface";
import { PrimeToast } from "./singleton";

const mapServerity: Record<ToastSeverity, string> = {
  [ToastSeverity.SUCCESS]: "Success",
  [ToastSeverity.ERROR]: "Error",
  [ToastSeverity.WARN]: "Warning",
  [ToastSeverity.INFO]: "Info",
};

export class ToastNotificationService implements INotificationService {
  show(severity: ToastSeverity, detail: string) {
    const summary = mapServerity[severity] ?? "Info";

    PrimeToast.show({
      severity: severity,
      summary,
      detail,
      life: 3000,
    });
  }
}

export const toastService = new ToastNotificationService();
