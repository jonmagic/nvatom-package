var _ = require('lodash');
var SearchBar = require("./SearchBar");

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
function disablePackages(app) {
  var packages = packagesToToggle();

  _.forEach(packages, function(p) {
    atom.packages.disablePackage(p);
    app.disabledPackages.push(p);
  });
}

// Internal: Enables packages that are listed as disabled on the app and then
// sets that list to an empty array.
function enablePackages(app) {
  _.forEach(app.disabledPackages, function(p) {
    atom.packages.enablePackage(p);
  });

  app.disabledPackages = [];
}

// Public: An App object that exposes a public API for starting and stopping
// the app and getting and setting the app state.
var App = {
  activated: false,
  disabledPackages: [],
  searchBar: null,

  // Public: Starts nvatom which puts Atom into Notational Velocity mode.
  //
  // state - Object with state values
  start: function(state) {
    this.activated = true;
    disablePackages(this);
    
    var topPanel    = atom.workspace.addTopPanel({item: new SearchBar()}),
        searchModel = topPanel.getItem().model();

    atom.commands.add("atom-workspace", "nvatom:search", function() {
      console.log(searchModel.getText());
    });
  },

  // Public: Stops nvatom and returns Atom to it's normal operating mode.
  stop: function() {
    enablePackages(this);
    this.activated = false;
    if(this.searchBar)
      this.searchBar.destroy();
  },

  // Public: Get the state of nvatom.
  //
  // Returns an Object.
  getState: function() {
    return {
      disabledPackages: this.disabledPackages,
      activated: this.activated
    }
  },

  // Public: Set the state of nvatom using the state object supplied by Atom.
  //
  // state - Object with state values
  setState: function(state) {
    if(state.disabledPackages != null || state.disabledPackages != undefined)
      this.disabledPackages = state.disabledPackages;

    if(state.activated === true || state.activated === false)
      this.activated = state.activated;
  }
}

module.exports = App;
