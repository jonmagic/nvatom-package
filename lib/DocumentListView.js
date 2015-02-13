"use 6to5";

let _ = require('lodash');
var atom = require("atom");
let Emitter = atom.Emitter;

class DocumentListView extends HTMLElement {
	createdCallback() {
		this.innerHTML = "<ul></ul>";
    this.emitter = new Emitter;
	}

  destroy() {
    this.emitter.dispose();
  }

	renderList(documents, selectedIndex = null) {
		this.innerHTML = "<ul></ul>";

		var element = this;

		_.forEach(documents, (details, index) => {
			let li = document.createElement("li");
			let title = document.createTextNode(details.filename);
			li.appendChild(title);
			if(selectedIndex == index){
				li.className = "selected"
			}
      li.onclick = (event) => {
        element.emitter.emit("did-select", details);
      }
			element.appendChild(li);
		});
	}

  onSelectDocument(callback) {
    this.emitter.on("did-select", callback);
  }
}

module.exports = document.registerElement('nvatom-document-list', DocumentListView);
