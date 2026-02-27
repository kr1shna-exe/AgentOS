import express from "express";
import cors from "cors"
import mainRouter from "./routes";

const app = express();

const PORT = 3000;
app.use(express());

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
    console.log("Server is running port : 8000")
});
