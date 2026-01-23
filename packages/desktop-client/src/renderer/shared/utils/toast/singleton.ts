import type { RefObject } from "react";
import type { Toast } from "primereact/toast";

class PrimeToastSingleton {
  private toastRef: RefObject<Toast | null> | null = null;

  set(ref: RefObject<Toast | null>) {
    this.toastRef = ref;
  }

  clear() {
    this.toastRef = null;
  }

  show(options: Parameters<Toast["show"]>[0]) {
    this.toastRef?.current?.show(options);
  }
}

export const PrimeToast = new PrimeToastSingleton();

export default PrimeToast;
