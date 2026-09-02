import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.saptechug.quitech",
  appName: "Quitech",
  webDir: "capacitor-www",
  server: {
    url: "https://quitech.online",
    cleartext: false,
  },
};

export default config;
