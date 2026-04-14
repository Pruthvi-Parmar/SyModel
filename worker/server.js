import express from "express";
import { spawnRuntime } from "./spawnRuntime.js";

const app = express();
app.use(express.json());

app.post("/run", async (req, res) => {
  const { blobId, objectId } = req.body;

  const result = await spawnRuntime({ blobId, objectId });
  res.json(result);
});

app.listen(4001, () =>
  console.log("Worker running on http://localhost:4001")
);
