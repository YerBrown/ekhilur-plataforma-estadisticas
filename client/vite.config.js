import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
          '@react-google-maps/api': '@react-google-maps/api/dist/index.js',
        },
      },
    server: {
        watch: {
            usePolling: true,
        },
        host: true, // needed for the Docker Container port mapping to work
        strictPort: true,
        port: 5173, // you can replace this port with any port
    },
});
