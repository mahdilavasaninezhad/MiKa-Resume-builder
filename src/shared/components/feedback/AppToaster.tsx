import { Toaster } from "sonner";

import { useThemeStore } from "../../stores/theme.store";

export function AppToaster() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Toaster
      theme={theme}
      position="top-center"
      richColors
      closeButton
      expand={false}
      visibleToasts={3}
      toastOptions={{
        duration: 3500,

        style: {
          background: "var(--glass)",
          border: "1px solid transparent",
          backdropFilter: "blur(8px)",
          borderRadius: "18px",
          boxShadow:
        "3px 3px 2px var(--shadow-dark), -3px -3px 2px var(--shadow-light)",
        },
      }}
    />
  );
}