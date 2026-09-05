import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { User } from "./models/User.js";
import bcrypt from "bcryptjs";
import { logger } from "./utils/logger.js";
const PORT = env.PORT || 5000;
async function bootstrap() {
  await connectDatabase();
  if (env.DEMO_MODE) {
    const email = "demo.scientist@researchpilot.ai";
    if (!(await User.findOne({ email })))
      await User.create({
        name: "Demo Researcher",
        email,
        passwordHash: await bcrypt.hash("DemoResearcher2026", 12),
      });
  }
  const server = app.listen(PORT, "0.0.0.0", () =>
    logger.info(`ResearchPilot backend running on port ${PORT}`),
  );
  const shutdown = async () =>
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}
bootstrap().catch((e) => {
  logger.error(`Startup failed: ${e.message}`);
  process.exit(1);
});
