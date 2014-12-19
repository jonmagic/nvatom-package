var App = require("./lib/App");

module.exports = {
  activate: function(state) {
    atom.commands.add("atom-workspace", "nvatom:toggle", function() {
      if(App.active){
        App.stop();
      }else{
        App.start();
      }
    });
  },

  deactivate: function() {
  },

  serialize: function() {
  }
}
