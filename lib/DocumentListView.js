var _ = require('lodash');
var PathWatcher = require("./PathWatcher");
var DocumentStore = require("./DocumentStore");

var DocumentListView = Object.create(HTMLElement.prototype);

function redraw(documentListView, query) {
  var ulElement = documentListView.children[0];

  while(ulElement.firstChild) {
    ulElement.removeChild(ulElement.firstChild);
  }

  _.forEach(documentListView.documentStore.search(query), function(details) {
    var item = document.createElement("li"),
        link = document.createElement("a"),
        text = document.createTextNode(details.filename);

    link.appendChild(text);
    item.appendChild(link);
    ulElement.appendChild(item);
  });
}

DocumentListView.createdCallback = function() {
  this.documentStore = new DocumentStore();
  this.innerHTML = "<ul></ul>";
}

DocumentListView.initialize = function(state) {
  var documentListView = this;

  this.pathWatcher = new PathWatcher(state.path, state.extensions, {
    update: function(details) {
      documentListView.documentStore.load(details);
    },
    remove: function(filename) {
      documentListView.documentStore.remove(filename);
    }
  });
}

DocumentListView.attachedCallback = function() {
  redraw(this, "");
}

DocumentListView.search = function(query) {
  redraw(this, query);
}

module.exports = document.registerElement('nvatom-document-list', {
  prototype: DocumentListView
});
