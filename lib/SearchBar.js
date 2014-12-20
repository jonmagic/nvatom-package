var SearchBarProto = Object.create(HTMLElement.prototype);

SearchBarProto.createdCallback = function() {
  this.innerHTML = "<atom-text-editor mini>Search documents</atom-text-editor>"
}

module.exports = document.registerElement('nvatom-search-bar', {
  prototype: SearchBarProto
});
