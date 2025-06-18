const express = require("express");
const { isMainThread, Worker } = require("node:worker_threads");

const app = express();
const port = process.env.PORT || 3000;

app.get("/non-blocking", (req, res) => {
  if (isMainThread) {
    console.log("This is the main thread, not a worker thread.");
  }

  console.log("Non-blocking operation completed");
  res.status(200).send("Non-blocking operation completed");
});

app.get("/blocking", (req, res) => {
  const worker = new Worker("./worker.js");

  worker.on("message", (counter) => {
    console.log(`Worker finished with counter: ${counter}`);
    res.status(200).send(`Worker finished with counter: ${counter}`);
  });

  worker.on("error", (error) => {
    console.error("Worker error:", error);
    res.status(500).send("An error occurred in the worker thread");
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
