import { decrKey, expireKey, incrKey } from "./cache.service.js";
import geoip from "geoip-lite";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";

function getLimiter({
  ttl = 5 * 60,
  limit = 100,
  skipSuccessfulRequests = false,
  skipFailedRequests = false,
  legacyHeaders = false,
}) {
  return rateLimit({
    windowMs: ttl * 1000, // 15 minutes
    limit: function (req) {
      const goip = geoip.lookup(req.ip);

      return goip.country === "EG" ? limit : 0;
    },
    handler: (req, res) => {
      res.status(429).json({ msg: "Too many times, Try again later" });
    },
    keyGenerator: function (req) {
      const ip = ipKeyGenerator(req.ip);
      return `${ip}/${req.path}`;
    },
    store: {
      async incr(key, cb) {
        const count = await incrKey({ key });

        if (count == 1) {
          await expireKey({ key, ttl });
        }

        cb(null, count);
      },

      async decrement(key) {
        await decrKey({ key });
      },
    },

    legacyHeaders,
    skipSuccessfulRequests,
    skipFailedRequests,
  });
}

export default getLimiter;
