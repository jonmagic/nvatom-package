var _ = require('lodash');
var atom = require("atom");
var Emitter = atom.Emitter;
var PathWatcher = require("./PathWatcher");
var DocumentStore = require("./DocumentStore");
var DocumentListItemView = require("./DocumentListItemView");

var DocumentListView = Object.create(HTMLElement.prototype);

function redraw(element) {
  var ulElement = element.children[0],
      query = element.query;

  ulElement.innerHTML = "";

  _.forEach(element.documentStore.search(query), function(details) {
    var item = new DocumentListItemView();
    item.initialize(details);
    item.onClick(function(event) {
      element.emitter.emit("did-select", {details: event.details});
    });

    ulElement.appendChild(item);
  });
}

DocumentListView.createdCallback = function() {
  this.query = null;
  this.documentStore = new DocumentStore();
  this.innerHTML = "<ul></ul>";
  this.emitter = new Emitter;
}

DocumentListView.initialize = function(state) {
  var element = this;

  this.pathWatcher = new PathWatcher(state.path, state.extensions, {
    update: function(details) {
      element.documentStore.load(details);
      element.search(element.query);
    },
    remove: function(filename) {
      element.documentStore.remove(filename);
      element.search(element.query);
    }
  });
}

DocumentListView.attachedCallback = function() {
  redraw(this);
}

DocumentListView.search = function(query) {
  this.query = query;
  redraw(this);
}

DocumentListView.onSelectDocument = function(callback) {
  this.emitter.on("did-select", callback);
}

module.exports = document.registerElement('nvatom-document-list', {
  prototype: DocumentListView
});
