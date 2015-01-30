var _ = require('lodash');
var SearchBarView = require("./SearchBarView");

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

// Public: An App object that exposes a public API for starting and stopping
// the app and getting and setting the app state.
var App = {
  attached: false,
  deactivatedPackages: [],
  searchBar: null,

  // Public: Starts nvatom which puts Atom into Notational Velocity mode.
  //
  // state - Object with state values
  start: function(state) {
    this.attached = true;
    deactivatePackages(this);
    this.searchBar = new SearchBarView();

    this.searchBarPanel = atom.workspace.addTopPanel({item: this.searchBar});
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
      delete this.searchBar;
    }
  },

  // Public: Get the state of nvatom.
  //
  // Returns an Object.
  getState: function() {
    return {
      deactivatedPackages: this.deactivatedPackages,
      attached: this.attached
    }
  },

  // Public: Set the state of nvatom using the state object supplied by Atom.
  //
  // state - Object with state values
  setState: function(state) {
    if(state.deactivatedPackages != null || state.deactivatedPackages != undefined)
      this.deactivatedPackages = state.deactivatedPackages;

    if(state.activated === true || state.activated === false)
      this.activated = state.activated;
  }
}

module.exports = App;
