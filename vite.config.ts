import { execSync } from "child_process";

// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

const __APP_VERSION__ = execSync("git rev-parse --short HEAD").toString().trim();

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    cacheDir: "node_modules/.vite-dotmail",
    define: {
      __APP_VERSION__: JSON.stringify(__APP_VERSION__),
    },
    optimizeDeps: {
      include: [
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom",
        "react-dom/client",
        "@tanstack/react-query",
        "@tanstack/react-router",
        "@tanstack/react-store",
        "@tanstack/react-virtual",
        "@tanstack/store",
        "lucide-react",
      ],
      esbuildOptions: {
        target: "es2022",
      },
    },
    server: {
      warmup: {
        clientFiles: [
          "./src/routes/__root.tsx",
          "./src/routes/index.tsx",
          "./src/components/generator/GeneratorCard.tsx",
          "./src/components/generator/ResultsList.tsx",
        ],
      },
    },
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null, // we register from our guarded wrapper only
        filename: "sw.js",
        devOptions: { enabled: false },
        manifest: false, // we ship our own /site.webmanifest
        workbox: {
          cleanupOutdatedCaches: true,
          navigateFallback: "/",
          navigateFallbackDenylist: [/^\/api\//, /^\/~oauth/, /^\/sitemap\.xml$/],
          globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,ico,woff2,webmanifest}"],
          globIgnores: ["**/robots.txt", "**/llms.txt", "**/sitemap.xml"],
          dontCacheBustURLsMatching: /\.[a-f0-9]{8,}\./,
          runtimeCaching: [
            {
              urlPattern: ({ sameOrigin, request }) =>
                sameOrigin &&
                ["script", "style", "worker", "image", "font", "manifest"].includes(
                  request.destination,
                ),
              handler: "CacheFirst",
              options: {
                cacheName: "dotmail-static-assets",
                expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [200] },
              },
            },
          ],
        },
      }),
    ],
  },
});
