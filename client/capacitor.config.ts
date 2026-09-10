import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.saptechug.quitech",
  appName: "Quitech",
  webDir: "capacitor-www",
  ...(process.env.CAPACITOR_SERVER_URL
    ? {
        server: {
          url: process.env.CAPACITOR_SERVER_URL,
          cleartext: false,
        },
      }
    : {}),
};

export default config;
