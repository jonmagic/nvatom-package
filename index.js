var React = require("atom").React;
var App = require("./lib/components/App");

module.exports = {
  activate: function(state) {
    atom.commands.add("atom-workspace", "nvatom:toggle", function() {
      var atomWorkspaceElement = atom.views.getView(atom.workspace);
      atomWorkspaceElement.style.display = "none";

      var nvAtomWorkspaceComponent = document.registerElement('nvatom-workspace', {
        prototype: Object.create(HTMLButtonElement.prototype)
      });
      var nvAtomWorkspaceElement = new nvAtomWorkspaceComponent;

      nvAtomWorkspaceElement.setAttribute("id", "nvatom-workspace");
      document.body.appendChild(nvAtomWorkspaceElement);

      React.renderComponent(App(), nvAtomWorkspaceElement);
    });
  },

  deactivate: function() {

  },

  serliaze: function() {

  }
}
