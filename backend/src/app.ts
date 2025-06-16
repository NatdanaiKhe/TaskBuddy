import express, { Application,Request,Response} from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config(); 
const app: Application = express();
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());;


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

// Health check
app.get("/health", (req:Request, res:Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;