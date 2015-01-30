var App = require("./lib/App");

module.exports = {
  activate: function() {
    atom.commands.add("atom-workspace", "nvatom:toggle", function() {
      if(App.attached){
        App.stop();
      }else{
        App.start();
      }
    });
  }
}
