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
  const dataSource = `https://${moveService}.${process.env.PSIBASE_DOMAIN}/graphql?query={move_rows{edges{node{id}}}}`;

  const fetchedIds = await fetch(dataSource)
    .then((data) => data.json())
    .then((data) => {
      const ids = [];

      data.data.move_rows.edges.forEach((edge) => {
        ids.push(+edge.node.id);
      });

      return ids;
    });

  if (!fetchedIds) {
    return "Failed to fetch moves";
  }

  const pushResult = await pushTransaction(moveService, "removeMoves", {
    json: JSON.stringify(fetchedIds)
  });

  return pushResult;
}
