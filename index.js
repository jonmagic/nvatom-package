var React = require("atom").React;
var App = require("./lib/components/App");
var PathWatcher = require("./lib/PathWatcher");
var DocumentStore = require("./lib/stores/DocumentStore");

module.exports = {
  activate: function(state) {
    atom.commands.add("atom-workspace", "nvatom:toggle", function() {
      var atomWorkspaceElement = atom.views.getView(atom.workspace);
      atomWorkspaceElement.style.display = "none";

      var nvAtomWorkspaceComponent = document.registerElement('nvatom-workspace', {
        prototype: Object.create(HTMLDivElement.prototype)
      });
      var nvAtomWorkspaceElement = new nvAtomWorkspaceComponent;

      nvAtomWorkspaceElement.setAttribute("id", "nvatom-workspace");
      document.body.appendChild(nvAtomWorkspaceElement);

      var documentStore = new DocumentStore;
      var pathEvents = {
        update: function(details) {
          documentStore.load(details);
        },
        remove: function(filename) {
          documentStore.remove(filename);
        }
      }

      new PathWatcher(atom.project.getPath(), [".md"], pathEvents);

      React.renderComponent(App({documentStore: documentStore}), nvAtomWorkspaceElement);
    });
  },

  deactivate: function() {

  },

  serliaze: function() {

  }
}
