const express = require("express");
const { isMainThread, Worker } = require("node:worker_threads");

const app = express();
const port = process.env.PORT || 3000;
const THREAD_COUNT = 4;

function createWorker(threadIndex) {
  console.log(`Creating worker thread ${threadIndex}`);

  return new Promise((resolve, reject) => {
    const worker = new Worker("./four-workers.js", {
      workerData: { thread_count: THREAD_COUNT, thread_index: threadIndex },
    });

    worker.on("message", (counter) => {
      console.log(`Worker finished with counter: ${counter}`);
      resolve(counter);
    });

    worker.on("error", (error) => {
      console.error("Worker error:", error);
      reject(error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker thread ${threadIndex} exited with code ${code}`);
        reject(
          new Error(`Worker thread ${threadIndex} exited with code ${code}`)
        );
      } else {
        console.log(`Worker thread ${threadIndex} completed successfully`);
        resolve();
      }
    });
  });
}

app.get("/non-blocking", (req, res) => {
  if (isMainThread) {
    console.log("This is the main thread, not a worker thread.");
  }

  console.log("Non-blocking operation completed");
  res.status(200).send("Non-blocking operation completed");
});

app.get("/blocking", async (req, res) => {
  const workerPromises = [];

  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker(i));
  }

  const thread_results = await Promise.all(workerPromises);
  console.log("thread_results:", thread_results);

  const total = thread_results.reduce((acc, result) => acc + result, 0);

  console.log(`All workers finished with total counter: ${total}`);
  res.status(200).send(`All workers finished with total counter: ${total}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
