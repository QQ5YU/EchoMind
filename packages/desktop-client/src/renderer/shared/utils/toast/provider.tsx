import React, { useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { PrimeToast } from "./singleton";
import "./styles.css";

export const PrimeToastProvider: React.FC = () => {
  const toastRef = useRef<Toast | null>(null);

  useEffect(() => {
    PrimeToast.set(toastRef);
    return () => PrimeToast.clear();
  }, []);

  return <Toast ref={toastRef} position="top-right" className="custom-toast" />;
};

export default PrimeToastProvider;
