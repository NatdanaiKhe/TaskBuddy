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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
const allowedOrigins = [
  "http://localhost:3000", 
];

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
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
  max: 100,
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});
app.use(limiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/tasks', taskRoutes);


// static image route
app.use(
  "/image",
  express.static("./src/uploads", {
    setHeaders: (res, path, stat) => {
      res.set("Access-Control-Allow-Origin", "http://localhost:3000");
    },
  })
);
// Health check
app.get("/health", (req:Request, res:Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;