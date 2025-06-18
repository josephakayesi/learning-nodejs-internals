const { workerData, parentPort } = require("worker_threads");

let counter = 0;

console.log("worker thread count:", workerData.thread_count);

for (let i = 0; i < 20_000_000_000 / workerData.thread_count; i++) {
  counter++; // Simulate a blocking operation
}

parentPort.postMessage(counter);
