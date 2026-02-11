import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "VoiceUIKitVue",
      formats: ["es", "cjs"],
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "vue",
        "@pipecat-ai/client-js",
        "@pipecat-ai/daily-transport",
        "@pipecat-ai/small-webrtc-transport",
      ],
    },
  },
});
