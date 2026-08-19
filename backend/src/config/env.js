import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function env_config() {
  // Load .env.local from backend root directory reliably
  const backendEnvLocal = path.resolve(__dirname, "../../../backend/.env.local");
  const directEnvLocal = path.resolve(__dirname, "../../.env.local");
  
  dotenv.config({ path: backendEnvLocal });
  dotenv.config({ path: directEnvLocal });
  dotenv.config({ path: ".env.local" });
  dotenv.config({ path: ".env" });
}

export default env_config;