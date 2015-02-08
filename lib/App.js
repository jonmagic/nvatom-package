"use 6to5";

class App {
  constructor(state = {}) {
    this.state = state;
  }

  start() {
    this.state.attached = true;

  }

  stop() {
    this.state.attached = false;
  }
}

module.exports = App;
