import { EventEmitter } from "events";

const eventManager = new EventEmitter();

eventManager.on("error", (error) => {
  console.error("error occurred:", error.message);
});

const sendUserCreatedEventEmail = (data) => {
  console.log("sending email for user creation:", data.email);
};

const setupUserCreatedAccount = (data) => {
  console.log("setting up account for user:", data.username);
};

const logUserCreatedEvent = (data) => {
  console.log("user created event logged:", data.username);
};

eventManager.on("user.created", (data) => {
  setImmediate(() => {
    logUserCreatedEvent(data);
  });
});
eventManager.once("user.created", setupUserCreatedAccount);
eventManager.on("user.created", sendUserCreatedEventEmail);

console.log(eventManager.listeners("user.created"));

eventManager.emit("user.created", {
  username: "john.doe",
  email: "john.doe@mail.com",
});

eventManager.emit("error", new Error("unable to process user creation event"));
