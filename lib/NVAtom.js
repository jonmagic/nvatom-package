"use 6to5";

let _ = require('lodash');
let PathWatcher = require("./PathWatcher");
let DocumentStore = require("./DocumentStore");
let SearchBarView = require("./SearchBarView");
let DocumentListView = require("./DocumentListView");

let neededPackages = [
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
let packagesToToggle = () => {
  let all   = atom.packages.getActivePackages();
  _.remove(all, (p) => p.constructor.name == "ThemePackage");
  let names = _.map(all, (p) => p.name);
  let final = _.difference(names, neededPackages);

  return final;
}

// Internal: Disables packages and stores the disabled packages on the app.
let deactivatePackages = (app) => {
  app.state.deactivatedPackages = [];
  let packages = packagesToToggle();

  _.forEach(packages, (p) => {
    atom.packages.deactivatePackage(p);
    app.state.deactivatedPackages.push(p);
  });
}

// Internal: Enables packages that are listed as disabled on the app and then
// sets that list to an empty array.
let activatePackages = (app) => {
  _.forEach(app.state.deactivatedPackages, (p) => {
    atom.packages.activatePackage(p);
  });

  app.state.deactivatedPackages = [];
}

// Internal: Focuses search box.
let focusSearch = () => {
  atom.workspace.getTopPanels()[0].item.focus();
}

// Internal: Arrow up was pressed.
let moveUp = (event) => {
  atom.nvatom.selectPreviousDocument();
}

// Internal: Arrow down was pressed.
let moveDown = (event) => {
  atom.nvatom.selectNextDocument();
}

let pressedEnter = () => {
  let filename;

  if(atom.nvatom.query.endsWith(".md")) {
    filename = atom.nvatom.query
  } else {
    filename = `${atom.nvatom.query}.md`
  }

  if(atom.nvatom.documentStore.get(filename) == undefined) {
    atom.nvatom.openDocumentByFilename(filename, {focus: true, save: true});
  } else {
    atom.views.getView(atom.nvatom.editor).focus();
  }
}

class NVAtom {
  constructor(state = {}) {
    this.state = state;
    this.query = "";
    this.searchResults = [];
    this.editor = null;
    this.selectedIndex = null;
  }

  start() {
    // deactivate packages we don't need
    deactivatePackages(this);

    // new DocumentListView added to atom workspace left panel
    this.documentList = new DocumentListView();
    this.documentListPanel = atom.workspace.addLeftPanel({item: this.documentList});
    this.documentList.onSelectDocument((details) => {
      this.openDocumentByFilename(details.filename, details.body);
      this.selectedIndex = _.findIndex(this.searchResults, (result) => {
        return result.filename == details.filename;
      })
      this.renderDocumentList();
      this.setQueryToSelectedDocumentFilename();
    })

    // new DocumentStore to handle document search
    this.documentStore = new DocumentStore();

    // new PathWatcher to notify documentStore of filesystem changes
    this.pathWatcher = new PathWatcher(atom.project.path, [".md"], {
      update: (details) => {
        this.documentStore.load(details);
        this.searchResults = this.documentStore.search(this.query);
        this.selectedIndex = 0;
        this.renderDocumentList();
      },

      remove: (filename) => {
        this.documentStore.remove(filename);
        this.searchResults = this.documentStore.search(this.query);
        this.selectedIndex = 0;
        this.renderDocumentList();
      }
    })

    // new SearchBarView added to atom workspace top panel
    this.searchBar = new SearchBarView();
    this.searchBarPanel = atom.workspace.addTopPanel({item: this.searchBar});
    this.searchBar.onDidChange((event) => {
      if(event.query.trim().length == 0) {
        this.query = null
        this.selectedIndex = null;
      } else {
        this.query = event.query
        this.selectedIndex = 0;
      }

      this.searchResults = this.documentStore.search(this.query);
      this.renderDocumentList();
      this.openSelectedDocument();
    })

    window.addEventListener("nvatom:focus-search", focusSearch);
    window.addEventListener("core:move-up", moveUp);
    window.addEventListener("core:move-down", moveDown);
    window.addEventListener("core:confirm", pressedEnter);

    this.state.attached = true;
  }

  stop() {
    activatePackages(this);

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
      this.documentList.destroy();
      this.documentList = null;
    }

    window.removeEventListener("nvatom:focus-search", focusSearch);
    window.removeEventListener("core:move-up", moveUp);
    window.removeEventListener("core:move-down", moveDown);

    this.state.attached = false;
  }

  addAtomCommands() {
    this.toggle = atom.commands.add("atom-workspace", "nvatom:toggle", () => {
      if(this.state.attached){
        this.stop();
      }else{
        this.start();
      }
    })
  }

  removeAtomCommands() {
    this.toggle.dispose();
  }

  openDocumentByFilename(filename, options = {}) {
    if(this.editor != null) {
      if(this.editor.isModified()) this.editor.save();
      this.editor.destroy();
    }

    atom.workspace.open(`${atom.project.path}/${filename}`, {activatePane: false}).then((editor) => {
      this.editor = editor;
      if(options.focus) atom.views.getView(editor).focus();
      if(options.save) this.editor.save();

      editor.onDidStopChanging(() => {
        if(this.editor.isModified()) this.editor.save();
      })
    })
  }

  openSelectedDocument() {
    if(this.searchResults[this.selectedIndex] != undefined) {
      let {filename, body} = this.searchResults[this.selectedIndex];
      this.openDocumentByFilename(filename, body);
    }
  }

  renderDocumentList() {
    this.documentList.renderList(this.searchResults, this.selectedIndex);
  }

  setQueryToSelectedDocumentFilename() {
    if(this.searchResults[this.selectedIndex] != undefined) {
      let {filename} = this.searchResults[this.selectedIndex];
      this.searchBar.setText(filename);
    }
  }

  selectNextDocument() {
    if(this.searchResults.length > 0) {
      if(this.selectedIndex != null) {
        let i = this.selectedIndex + 1;
        if(this.searchResults[i] != undefined && i < this.searchResults.length) {
          this.selectedIndex++;
          this.renderDocumentList();
          this.openSelectedDocument();
          this.setQueryToSelectedDocumentFilename();
        }
      }else{
        this.selectedIndex = 0;
        this.renderDocumentList();
        this.openSelectedDocument();
        this.setQueryToSelectedDocumentFilename();
      }
    }
  }

  selectPreviousDocument() {
    if(this.searchResults.length > 0) {
      if(this.selectedIndex != null) {
        let i = this.selectedIndex - 1;
        if(this.searchResults[i] != undefined && i >= 0) {
          this.selectedIndex--;
          this.renderDocumentList();
          this.openSelectedDocument();
          this.setQueryToSelectedDocumentFilename();
        }
      }else{
        this.selectedIndex = this.searchResults.length - 1;
        this.renderDocumentList();
        this.openSelectedDocument();
        this.setQueryToSelectedDocumentFilename();
      }
    }
  }
}

module.exports = NVAtom;