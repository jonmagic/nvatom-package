var App = require("./lib/App");

module.exports = {
  activate: function(state) {
    App.setState(state);

    atom.commands.add("atom-workspace", "nvatom:toggle", function() {
      if(App.activated){
        App.stop(state);
      }else{
        App.start(state);
      }
    });
  },

  deactivate: function() {
  },

  serialize: function() {
    return App.getState();
  }
}
