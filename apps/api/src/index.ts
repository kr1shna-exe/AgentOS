import express from "express";
import cors from "cors";
import { env } from "./config/env"
import mainRouter from "./routes";
import { initTools } from "./tools";

initTools();

const app = express();

const PORT = env.PORT ?? 8000;
app.use(express.json());

const ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
app.use(
    cors({
        origin: ALLOWED_ORIGINS,
        credentials: true,
    }),
);

app.use("/api/v1", mainRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
