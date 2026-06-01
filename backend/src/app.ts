import express, { Application,Request,Response} from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config(); 
const app: Application = express();
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import bookingRoutes from "./routes/booking.route";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, "");
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

const isAllowedOrigin = (origin?: string) => {
  if (!origin) return true;
  return allowedOrigins.includes(normalizeOrigin(origin));
};

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
app.use(cookieParser());
app.use(morgan("combined"));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200,
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});

app.use(limiter);

// Routes
app.use('/api/users', authLimiter,userRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/tasks', taskRoutes);
app.use("/api/booking", bookingRoutes);


// static image route
app.use(
  "/image",
  express.static("./src/uploads", {
    setHeaders: (res, _path, _stat) => {
      const requestOrigin = res.req.headers.origin as string | undefined;
      if (requestOrigin && isAllowedOrigin(requestOrigin)) {
        res.set("Access-Control-Allow-Origin", requestOrigin);
        res.set("Vary", "Origin");
      }
    },
  })
);
// Health check
app.get("/health", (req:Request, res:Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
