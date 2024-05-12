import { toast } from "react-toastify";
import { toastConfig } from "./types";

export const useToast = () => {
    const notifySuccess = (payload: string) => toast.success(payload, toastConfig);

    const notifyError = (payload: string) => toast.error(payload, toastConfig);

    return { notifySuccess, notifyError };
}