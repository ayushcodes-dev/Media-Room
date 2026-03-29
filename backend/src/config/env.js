import dotenv from "dotenv";


function env_config() {
  dotenv.config({
    path: ".env.local"
  });
}
export default env_config