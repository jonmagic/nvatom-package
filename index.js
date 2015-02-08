"use 6to5";
let App = require("./lib/App");
let app;

let toggleApp = () => {
  if(app.state.attached){
    console.log("stopping app");
    app.stop();
  }else{
    console.log("starting app");
    app.start();
  }
}

exports.activate = (state) => {
  app = new App(state);
  atom.commands.add("atom-workspace", "nvatom:toggle", toggleApp);

  return app;
}

exports.serialize = () => {
  return app.state;
}

exports.deactivate = () => {
  app = null;

  return app;
}
