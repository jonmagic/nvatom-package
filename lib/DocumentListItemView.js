var DocumentListItemView = Object.create(HTMLElement.prototype);
var atom = require("atom");
var Emitter = atom.Emitter;

DocumentListItemView.createdCallback = function() {
  this.innerHTML = "<li></li>";
  this.emitter = new Emitter;
}

DocumentListItemView.attachedCallback = function() {
  var element = this;
  
  element.addEventListener("click", function(event) {
    element.emitter.emit("did-click", {details: element.details});
  });
}

DocumentListItemView.initialize = function(details) {
  this.details = details;
  this.appendChild(document.createTextNode(details.filename));
}

DocumentListItemView.onClick = function(callback) {
  this.emitter.on("did-click", callback);
}

module.exports = document.registerElement('nvatom-document-list-item', {
  prototype: DocumentListItemView
});
