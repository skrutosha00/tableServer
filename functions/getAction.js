import {
  addUsers,
  removeUsers,
  removeAllUsers
} from "#root/functions/userFunctions.js";

import {
  addGames,
  removeGames,
  removeAllGames
} from "#root/functions/gameFunctions.js";

import {
  addMoves,
  removeMoves,
  removeAllMoves
} from "#root/functions/moveFunctions.js";

const actionFunctions = {
  addUsers,
  removeUsers,
  removeAllUsers,

  addGames,
  removeGames,
  removeAllGames,

  addMoves,
  removeMoves,
  removeAllMoves
};

function defaultFunction() {
  return "There is no such method";
}

function getActionParam(action, body) {
  if (["addUsers", "addGames", "addMoves"].includes(action)) {
    return body.data.rows;
  }

  if (["removeUsers", "removeGames", "removeMoves"].includes(action)) {
    return body.data.ids;
  }
}

function getActionFunction(action) {
  if (!actionFunctions[action]) {
    return defaultFunction;
  }

  return actionFunctions[action];
}

export default function getAction(action, body) {
  return {
    actionFunction: getActionFunction(action),
    actionParam: getActionParam(action, body)
  };
}
