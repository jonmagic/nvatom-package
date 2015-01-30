var SearchBarView = Object.create(HTMLElement.prototype);

SearchBarView.createdCallback = function() {
  this.innerHTML = "<atom-text-editor mini>Search documents</atom-text-editor>"
}

SearchBarView.attachedCallback = function() {
  var model = this.children[0].getModel();

  model.onDidStopChanging(function() {
    console.log(model.getText());
  });
}

SearchBarView.model = function() {
  return this.children[0].getModel();
}

module.exports = document.registerElement('nvatom-search-bar', {
  prototype: SearchBarView
});
