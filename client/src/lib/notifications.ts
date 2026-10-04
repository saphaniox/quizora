import Swal, { type SweetAlertIcon } from "sweetalert2";

type ToastOptions = {
  description?: string;
};

const toast = Swal.mixin({
  toast: true,
  position: "top",
  backdrop: false,
  grow: false,
  showConfirmButton: false,
  showCloseButton: false,
  timer: 4000,
  timerProgressBar: true,
  heightAuto: false,
  customClass: {
    container: "quitech-swal-container",
    popup: "quitech-swal-popup",
    title: "quitech-swal-title",
    htmlContainer: "quitech-swal-description",
  },
});

function notify(icon: SweetAlertIcon, title: string, options?: ToastOptions): void {
  const isCompact = window.matchMedia("(max-width: 640px)").matches;
  void toast.fire({
    icon,
    title,
    text: options?.description,
    position: isCompact ? "top" : "top-end",
  });
}

export const notifications = {
  success: (title: string, options?: ToastOptions) => notify("success", title, options),
  error: (title: string, options?: ToastOptions) => notify("error", title, options),
  info: (title: string, options?: ToastOptions) => notify("info", title, options),
  warning: (title: string, options?: ToastOptions) => notify("warning", title, options),
};
