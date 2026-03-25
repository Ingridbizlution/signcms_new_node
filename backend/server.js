import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`SignCMS backend running at http://localhost:${env.PORT}`);
  console.log(`Swagger docs: http://localhost:${env.PORT}/api-docs`);
});
