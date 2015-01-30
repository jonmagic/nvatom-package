var _ = require('lodash');
var SearchBarView = require("./SearchBarView");
var DocumentListView = require("./DocumentListView");

// The packages we'll need for nvatom to function.
var neededPackages = [
  "autosave",
  "bracket-matcher",
  "command-palette",
  "dev-live-reload",
  "language-gfm",
  "markdown-preview",
  "nvatom",
  "spell-check",
  "whitespace",
  "wrap-guide"
]

// Internal: Get a list of packages that can be turned off. Subtracts themes and
// packages we need for nvatom from the list of all active packages.
//
// Returns an Array.
function packagesToToggle() {
  var all         = atom.packages.getActivePackages();
  _.remove(all, function(p) { return p.constructor.name == "ThemePackage" });
  var names       = _.map(all, function(p) { return p.name });
  var final       = _.difference(names, neededPackages);

  return final;
}

// Internal: Disables packages and stores the disabled packages on the app.
function deactivatePackages(app) {
  var packages = packagesToToggle();

  _.forEach(packages, function(p) {
    atom.packages.deactivatePackage(p);
    app.deactivatedPackages.push(p);
  });
}

// Internal: Enables packages that are listed as disabled on the app and then
// sets that list to an empty array.
function activatePackages(app) {
  _.forEach(app.deactivatedPackages, function(p) {
    atom.packages.activatePackage(p);
  });

  app.deactivatedPackages = [];
}

function focusSearch(event) {
  atom.workspace.getTopPanels()[0].item.focus();
}

// Public: An App object that exposes a public API for starting and stopping
// the app.
var App = {
  attached: false,
  deactivatedPackages: [],
  searchBar: null,

  // Public: Starts nvatom which puts Atom into Notational Velocity mode.
  start: function() {
    var app = this;

    app.attached = true;
    deactivatePackages(app);
    app.searchBar = new SearchBarView();
    app.documentList = new DocumentListView();
    app.documentList.initialize({path: atom.project.path, extensions: [".md"]});

    app.searchBarPanel = atom.workspace.addTopPanel({item: app.searchBar});
    app.documentListPanel = atom.workspace.addLeftPanel({item: app.documentList});

    app.searchBar.onDidChange(function(event) {
      app.documentList.search(event.query);
    });

    app.documentList.onSelectDocument(function(event) {
      _.forEach(atom.workspace.getTextEditors(), function(editor) {
        editor.save();
        editor.destroy();
      });
      atom.workspace.open(atom.project.path + "/" + event.details.filename);
      _.forEach(atom.workspace.getTextEditors(), function(editor) {
        editor.onDidStopChanging(function() {
          editor.save();
        });
      });
    });

    window.addEventListener("nvatom:focus-search", focusSearch);
  },

  // Public: Stops nvatom and returns Atom to it's normal operating mode.
  stop: function() {
    activatePackages(this);
    this.attached = false;

    if(this.searchBarPanel != undefined || this.searchBarPanel != null) {
      this.searchBarPanel.destroy();
      this.searchBarPanel = null;
    }

    if(this.searchBar != undefined || this.searchBar != null) {
      this.searchBar.destroy();
      this.searchBar = null;
    }

    if(this.documentListPanel != undefined || this.documentListPanel != null) {
      this.documentListPanel.destroy();
      this.documentListPanel = null;
    }

    if(this.documentList != undefined || this.documentList != null) {
      delete this.documentList;
    }

    window.removeEventListener("nvatom:focus-search", focusSearch);
  }
}

module.exports = App;
