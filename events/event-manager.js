export class EventManager extends EventEmitter {
  constructor() {
    super();
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    super.on(event, listener);
  }

  off(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((l) => l !== listener);
      super.off(event, listener);
    }
  }

  emit(event, ...args) {
    if (this.events[event]) {
      super.emit(event, ...args);
    }
  }
}
