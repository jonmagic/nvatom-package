"use 6to5";
var atom = require("atom");
var Emitter = atom.Emitter;

class SearchBarView extends HTMLElement {
  createdCallback() {
    this.innerHTML = `
      <atom-text-editor mini placeholder-text='Search documents'>
      </atom-text-editor>
    `
    this.emitter = new Emitter;
    this.settingText = false;
  }

  setText(text) {
    this.settingText = true;
    this.children[0].getModel().setText(text);
    this.focus();
  }

  attachedCallback() {
    let element = this;
    let model = element.children[0].getModel();

    model.onDidChange(() => {
      if(this.settingText) {
        this.settingText = false;
      } else {
        element.emitter.emit("did-change", {query: model.getText()});
      }
    })
  }

  destroy() {
    this.emitter.dispose();
  }

  onDidChange(callback) {
    this.emitter.on("did-change", callback);
  }

  focus() {
    this.children[0].focus();
    this.children[0].getModel().selectAll();
  }
}

module.exports = document.registerElement('nvatom-search-bar', SearchBarView);
