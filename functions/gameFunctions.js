import pushTransaction from "#root/functions/pushTransaction.js";

const gameService = process.env.GAME_SERVICE;

export async function addGames(games) {
  games.forEach((game) => {
    const rows = [
      "ingame",
      "invested",
      "payout",
      "guides_payout",
      "devs_payout",
      "sigen_payout",
      "marketing_payout",
      "winners_payout",
      "forum_payout",
      "liquidity_payout",
      "apple_payout",
      "auto_payout",
      "market_makers_payout",
      "salary_payout",
      "investors_payout",
      "housing_payout"
    ];

    for (let row of rows) {
      if (game[row]) {
        game[row] *= 100;
      }
    }
  });

  const pushResult = await pushTransaction(gameService, "addGames", {
    json: JSON.stringify(games)
  });

  return pushResult;
}

export async function removeGames(gameIds) {
  const pushResult = await pushTransaction(gameService, "removeGames", {
    json: JSON.stringify(gameIds)
  });

  return pushResult;
}

export async function removeAllGames() {
  const dataSource = `https://${gameService}.${process.env.PSIBASE_DOMAIN}/graphql?query={game_rows{edges{node{id}}}}`;

  const fetchedIds = await fetch(dataSource)
    .then((data) => data.json())
    .then((data) => {
      const ids = [];

      data.data.game_rows.edges.forEach((edge) => {
        ids.push(+edge.node.id);
      });

      return ids;
    });

  if (!fetchedIds) {
    return "Failed to fetch games";
  }

  const pushResult = await pushTransaction(gameService, "removeGames", {
    json: JSON.stringify(fetchedIds)
  });

  return pushResult;
}
