import express from "express";
import authController from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import globalErrMiddleware from "./middleware/error.middleware.js";
import notFoundMiddleware from "./middleware/notFound.middleware.js";
import dbConnection from "./DB/connection.js";
import { PORT } from "./config/config.js";
import messageRouter from "./modules/message/message.controller.js";
import helmet from "helmet";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import geoip from "geoip-lite";
import { decrKey, expireKey, incrKey } from "./common/cache.service.js";
import getLimiter from "./common/rate-limit.js";

async function bootstrap() {
  const app = express();

  await dbConnection();

  app.use(helmet());

  app.set("trust proxy", true);

  const limiter = getLimiter({ ttl: 15 * 60, limit: 100 });

  app.use(limiter);

  app.use(express.json());

  app.use("/assets", express.static("./assets"));

  app.use("/auth", authController);
  app.use("/user", userRouter);
  app.use("/message", messageRouter);

  app.all("{/*dummy}", notFoundMiddleware);
  app.use(globalErrMiddleware);

  app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
}

bootstrap();
