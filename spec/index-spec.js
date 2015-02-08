"use 6to5";

let App = require("../lib/App");
let {activate, serialize, deactivate} = require("../index");

describe("activate", () => {
  it("sets app to new instance of App and returns app", () => {
    let app = activate();
    expect(app.constructor.name).toEqual("App");
  })
})

describe("serialize", () => {
  it("returns app state", () => {
    let app = activate();
    expect(serialize()).toEqual(app.state);
  })
})

describe("deactivate", () => {
  it("sets app to null and returns app", () => {
    let app = deactivate();
    expect(app).toBeNull();
  })
})
