import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { vercelPreset } from "@vercel/react-router/vite"; // 1. 导入 Vercel 预设
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter({
      presets: [vercelPreset()], // 2. 在这里启用它
    }),
    tsconfigPaths(),
  ],
});
