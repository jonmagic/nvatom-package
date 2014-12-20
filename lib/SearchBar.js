var SearchBarProto = Object.create(HTMLElement.prototype);

SearchBarProto.createdCallback = function() {
  this.innerHTML = "<atom-text-editor mini>Search documents</atom-text-editor>"
}

SearchBarProto.attachedCallback = function() {
  var model = this.children[0].getModel();

  model.onDidStopChanging(function() {
    console.log(model.getText());
  });
}

SearchBarProto.model = function() {
  return this.children[0].getModel();
}

module.exports = document.registerElement('nvatom-search-bar', {
  prototype: SearchBarProto
});
