var _ = require('lodash');

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

function packagesToToggle() {
  var all         = atom.packages.getActivePackages();
  _.remove(all, function(p) { return p.constructor.name == "ThemePackage" });
  var names       = _.map(all, function(p) { return p.name });
  var final       = _.difference(names, neededPackages);

  return final;
}

function disablePackages(app) {
  var packages = packagesToToggle();

  _.forEach(packages, function(p) {
    atom.packages.disablePackage(p);
    app.disabledPackages.push(p);
  });
}

function enablePackages(app) {
  _.forEach(app.disabledPackages, function(p) {
    atom.packages.enablePackage(p);
  });

  app.disabledPackages = [];
}

var App = {
  activated: false,
  disabledPackages: [],

  start: function(state) {
    this.activated = true;
    disablePackages(this);
  },

  stop: function(state) {
    enablePackages(this);
    this.activated = false;
  },

  getState: function() {
    return {
      disabledPackages: this.disabledPackages,
      activated: this.activated
    }
  },

  setState: function(state) {
    if(state.disabledPackages != null || state.disabledPackages != undefined)
      this.disabledPackages = state.disabledPackages;

    if(state.activated === true || state.activated === false)
      this.activated = state.activated;
  }
}

module.exports = App;
