import pushTransaction from "#root/functions/pushTransaction.js";

const moveService = process.env.MOVE_SERVICE;

export async function addMoves(moves) {
  moves.forEach((move) => {
    const rows = ["ingame", "invested"];

    for (let row of rows) {
      if (move[row]) {
        move[row] *= 100;
      }
    }

    move.game_id = move.game_id + "_" + move.bot_type;
  });

  const pushResult = await pushTransaction(moveService, "addMoves", {
    json: JSON.stringify(moves)
  });

  return pushResult;
}

export async function removeMoves(moveIds) {
  const pushResult = await pushTransaction(moveService, "removeMoves", {
    json: JSON.stringify(moveIds)
  });

  return pushResult;
}

export async function removeAllMoves() {
  const pushResult = await pushTransaction(moveService, "removeAllMoves");
  return pushResult;
}
