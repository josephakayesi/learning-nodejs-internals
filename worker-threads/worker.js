const { parentPort, workerData } = require("worker_threads");

let counter = 0;
console.log(`Worker thread ${workerData.thread_index} started`);
for (let i = 0; i < 20_000_000_000; i++) {
  counter++; // Simulate a blocking operation
}

parentPort.postMessage(counter);
console.log(`Worker thread ${workerData.thread_index} finished`);
