const REQUIRED_ENV_VARS = [
  "PORT",
  "SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "CLIENT_URL",
];


const validateEnv = () => {
  const missing = [];

  REQUIRED_ENV_VARS.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    console.error(
      `❌ Environment Validation Error: The following required environment variables are missing:\n${missing.map((v) => `   - ${v}`).join("\n")}`
    );
    console.error("Please configure your .env file properly. Exiting process.");
    process.exit(1);
  }
};

module.exports = {
  validateEnv,
};
