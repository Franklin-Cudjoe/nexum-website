import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;
const allowedOrigin = process.env.FRONTEND_ORIGIN || "*";

app.use(express.json());
app.use(cors({ origin: allowedOrigin }));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/api/status", (_req, res) => {
  res.status(200).json({
    service: "nexum-backend",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
