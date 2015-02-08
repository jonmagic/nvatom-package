"use 6to5";
let App = require("../../lib/App");

describe("nvatom package", () => {
  let app, state, editor, searchBar, documentList, workspaceElement;

  beforeEach(() => {
    state = {foo: "bar"};
    app = new App(state);
  })

  describe("constructor", () => {
    it("sets instance.state to state", () => {
      expect(app.state).toEqual(state);
    })
  })

  describe("start", () => {
    beforeEach(() => {
      workspaceElement = atom.views.getView(atom.workspace);
      atom.__workspaceView = {};

      waitsForPromise(() => {
        atom.packages.activatePackage("nvatom").then((package) => {
          searchBar = workspaceElement.querySelector("nvatom-search-bar");
          console.log(package);
          console.log(package.mainModule);
        })
      })
      app.start();
    })

    it("sets instance.state.attached = true", () => {
      expect(app.state.attached).toBe(true);
    })

    it("adds search bar to screen", () => {
    })
  })

  describe("stop", () => {
    it("sets instance.state.attached = false", () => {
      app.stop();
      expect(app.state.attached).toBe(false);
    })
  })
})

// describe("App#start", function() {
//
//   it("adds document list to screen", function() {});
//   it("hides open editors", function() {});
//   it("adds editor to screen with Help.md loaded", function() {});
//   it("disables unneeded packages", function() {});
//   it("binds events", function() {});
// });
//
// describe("App#stop", function() {
//   it("removes search bar from screen", function() {});
//   it("removes document list from screen", function() {});
//   it("closes it's own editor", function() {});
//   it("reveals previous editors", function() {});
//   it("enables disabled packages", function() {});
//   it("unbinds events", function() {});
// });
