module.exports = {
  activate: function(state) {
    atom.commands.add("atom-workspace", "nvatom:toggle", function() {
      var workspaceElement = atom.views.getView(atom.workspace);
      workspaceElement.style.display = "none";

      var containerElement = document.createElement("div");
      containerElement.setAttribute("id", "nvatom-container");
      document.body.appendChild(containerElement);
    })
  },

  deactivate: function() {

  },

  serliaze: function() {

  }
}
