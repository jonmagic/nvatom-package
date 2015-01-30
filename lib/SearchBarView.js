var SearchBarView = Object.create(HTMLElement.prototype);
var atom = require("atom");
var Emitter = atom.Emitter;

SearchBarView.createdCallback = function() {
  this.innerHTML = "<atom-text-editor mini placeholder-text='Search documents'></atom-text-editor>"
  this.emitter = new Emitter;
}

SearchBarView.attachedCallback = function() {
  var element = this,
      model = element.children[0].getModel();


  model.onDidStopChanging(function() {
    element.emitter.emit("did-change", {query: model.getText()});
  });
}

SearchBarView.destroy = function() {
  this.emitter.dispose();
}

SearchBarView.onDidChange = function(callback) {
  this.emitter.on("did-change", callback);
}

module.exports = document.registerElement('nvatom-search-bar', {
  prototype: SearchBarView
});
