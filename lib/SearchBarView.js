var SearchBarView = Object.create(HTMLElement.prototype);

SearchBarView.createdCallback = function() {
  this.innerHTML = "<atom-text-editor mini placeholder-text='Search documents'></atom-text-editor>"
}

SearchBarView.model = function() {
  return this.children[0].getModel();
}

module.exports = document.registerElement('nvatom-search-bar', {
  prototype: SearchBarView
});
