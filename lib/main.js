"use 6to5";
let NVAtom = require("./NVAtom");

exports.activate = (state) => {
  this.nvatom = new NVAtom(state);
  this.nvatom.addAtomCommands();
}

exports.serialize = () => {
  return this.nvatom.state;
}

exports.deactivate = () => {
  this.nvatom.removeAtomCommands();
  delete this.nvatom;
}
