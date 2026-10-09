import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
      webpackMemoryOptimizations: true
  },
  allowedDevOrigins: ['loboapi.cornsnake.fyi'],
  async headers() {
      return [
          {
              // matching all API routes
              source: "/:path*",
              headers: [
                  { key: "Access-Control-Allow-Origin", value: "http://localhost:8081" }
              ]
          }
      ]
  }
};

export default nextConfig;
// Esta es la prueba 1500 para snoarqube y su integracion con gchat para enviar errores durante las pruebas.
