var DocumentStore = require("./lib/DocumentStore");
var PathWatcher   = require("./lib/PathWatcher");

var NVatom = {
  activate: function(state) {
    atom.commands.add("atom-workspace", "nvatom:toggle", function() {
      var workspaceElement = atom.views.getView(atom.workspace);

      workspaceElement.style.display = "none";
      var containerElement = document.createElement("div");
      containerElement.setAttribute("id", "nvatom-container");
      var searchElement = document.createElement("input");
      searchElement.setAttribute("id", "search");
      var documentListElement = document.createElement("ul");
      documentListElement.setAttribute("id", "document-list");

      containerElement.appendChild(searchElement);
      containerElement.appendChild(documentListElement);
      document.body.appendChild(containerElement);

      var documentStore = new DocumentStore;
      var pathEvents = {
        update: function(details) {
          documentStore.load(details);
          var documentListItemElement = document.createElement("li");
          documentListItemElement.textContent = details.filename;
          containerElement.appendChild(documentListItemElement);
        },
        remove: function(filename) {
          documentStore.remove(filename);
        }
      }

      new PathWatcher(atom.project.getPath(), [".md"], pathEvents);
    })
  },

  deactivate: function() {

  },

  serliaze: function() {

  }
}

module.exports = NVatom;
