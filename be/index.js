import express from "express";
import cors from "cors";
import { createProvider } from "./provider.js";
import { getMetrics  } from "./metrics.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const RPC_URL = process.env.CHAINSTACK_RPC_URL;

const provider = createProvider(RPC_URL);

app.get("/metrics", async (req, res) => {
  try {
    console.log("\n--- Fetching Monad Metrics ---");
    const data = await getMetrics(provider);
    res.json(data);
  } catch (err) {
    console.error("Metrics error:", err);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
