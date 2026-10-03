import Swal, { type SweetAlertIcon } from "sweetalert2";

type ToastOptions = {
  description?: string;
};

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 4500,
  timerProgressBar: true,
  heightAuto: false,
  customClass: {
    popup: "quitech-swal-popup",
    title: "quitech-swal-title",
    htmlContainer: "quitech-swal-description",
  },
});

function notify(icon: SweetAlertIcon, title: string, options?: ToastOptions): void {
  void toast.fire({
    icon,
    title,
    text: options?.description,
  });
}

export const notifications = {
  success: (title: string, options?: ToastOptions) => notify("success", title, options),
  error: (title: string, options?: ToastOptions) => notify("error", title, options),
  info: (title: string, options?: ToastOptions) => notify("info", title, options),
  warning: (title: string, options?: ToastOptions) => notify("warning", title, options),
};
