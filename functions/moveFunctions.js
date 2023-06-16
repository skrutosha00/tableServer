import pushTransaction from "#root/functions/pushTransaction.js";

const moveService = "moveback";

export async function addMoves(moves) {
  moves.forEach((move) => {
    let rows = ["ingame", "invested"];

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
  const dataSource = `https://${moveService}.royfractal.com/graphql?query={move_rows{edges{node{id}}}}`;

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

  console.log(fetchedIds);

  const pushResult = await pushTransaction(moveService, "removeMoves", {
    json: JSON.stringify(fetchedIds)
  });

  return pushResult;
}
