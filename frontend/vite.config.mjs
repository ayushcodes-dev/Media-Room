import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import babel from '@rolldown/plugin-babel'
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isVercel = process.env.VERCEL === "1";

// https://vite.dev/config/
export default defineConfig(async () => {
  const plugins = [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ];

  // Puppeteer-based prerender does not run reliably on Vercel's build environment.
  if (!isVercel) {
    const { default: Prerender } = await import("@prerenderer/rollup-plugin");
    plugins.push(
      Prerender({
        staticDir: path.join(__dirname, "dist"),
        routes: ["/"],
      }),
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
