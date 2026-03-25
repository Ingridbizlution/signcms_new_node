export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "SignCMS Lightweight Backend",
    version: "1.0.0",
    description: "Starter Node.js backend for SignCMS.",
  },
  servers: [{ url: "http://localhost:3001" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/api/v1/auth/login": { post: { summary: "Login" } },
    "/api/v1/auth/register": { post: { summary: "Register first admin" } },
    "/api/v1/auth/me": { get: { summary: "Current user", security: [{ bearerAuth: [] }] } },
    "/api/v1/organizations": {
      get: { summary: "List organizations", security: [{ bearerAuth: [] }] },
      post: { summary: "Create organization", security: [{ bearerAuth: [] }] },
    },
    "/api/v1/media-items": { get: { summary: "List media", security: [{ bearerAuth: [] }] } },
    "/api/v1/media-items/upload": { post: { summary: "Upload media", security: [{ bearerAuth: [] }] } },
  },
};
