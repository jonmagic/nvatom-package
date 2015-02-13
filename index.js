"use 6to5";
let NVAtom = require("./lib/NVAtom");

exports.activate = (state) => {
  atom.nvatom = new NVAtom(state);
  atom.nvatom.addAtomCommands();
}

exports.serialize = () => {
  return atom.nvatom.state;
}

exports.deactivate = () => {
  atom.nvatom.removeAtomCommands();
  delete atom.nvatom;
}
