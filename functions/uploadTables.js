import pgPkg from "pg";

import { tableUploadLogger } from "#root/logs/logger.js";

import { addUsers } from "#root/functions/userFunctions.js";
import { addGames } from "#root/functions/gameFunctions.js";
import { addMoves } from "#root/functions/moveFunctions.js";

import wait from "#root/utils/wait.js";
import getTimestamp from "#root/utils/getTimestamp.js";

const { Client } = pgPkg;

const botNames = ["x1", "x10", "x100", "x1000"];
const botConnectionStrings = {
  x1: process.env.DB_LINK_X1,
  x10: process.env.DB_LINK_X10,
  x100: process.env.DB_LINK_X100,
  x1000: process.env.DB_LINK_X1000
};

const tableNames = ['"user"', "game", "move"];
const tableFunctions = {
  '"user"': addUsers,
  game: addGames,
  move: addMoves
};

const idCounters = {
  '"user"': 0,
  game: 0,
  move: 0
};

let client;

export default async function uploadTables() {
  resetIdCounters();

  for (let bot of botNames) {
    client = new Client({
      connectionString: botConnectionStrings[bot],
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    });

    await client.connect();

    for (let tableName of tableNames) {
      const tableLength = await client.query(`SELECT COUNT(*) FROM ${tableName};`);

      tableUploadLogger.info(
        `Bot: ${bot} Table: ${tableName} Length: ${tableLength.rows[0].count} Time: ${getTimestamp()}`
      );

      await uploadTable(bot, tableName);
    }

    await client.end();
  }
}

async function uploadTable(bot, tableName) {
  const pgBatchSize = 10000;
  const tableBatchSize = 250;
  const batchAmount = pgBatchSize / tableBatchSize;

  let offset = 0;

  while (true) {
    const result = await client.query(`SELECT * FROM ${tableName} OFFSET ${offset} LIMIT ${pgBatchSize}`);

    const rows = result.rows;

    if (rows.length == 0) {
      break;
    }

    for (let i = 0; i < batchAmount; i++) {
      const cutRows = rows.slice(i * tableBatchSize, (i + 1) * tableBatchSize);

      if (cutRows.length == 0) {
        break;
      }

      loadRows(cutRows, bot, tableName);
      await wait(100);
    }

    offset += pgBatchSize;
  }
}

async function loadRows(rows, bot, tableName) {
  rows.forEach((row) => {
    row.pg_id = row.id + "_" + bot;
    row.id = idCounters[tableName];
    row.bot_type = bot;

    idCounters[tableName]++;
  });

  const expectedRes = "OK";
  const uploadResult = await tableFunctions[tableName](rows);

  const successLog = `Bot: ${bot} Table: ${tableName} Result: ${uploadResult} Time: ${getTimestamp()}`;
  const errorLog = `Bot: ${bot} Table: ${tableName} Error: ${uploadResult} Time: ${getTimestamp()}`;

  if (uploadResult == expectedRes) {
    tableUploadLogger.info(successLog);

    console.log(successLog);
  } else {
    tableUploadLogger.error(errorLog);

    console.error(errorLog);
  }

  return uploadResult;
}

function resetIdCounters() {
  for (let tableName of tableNames) {
    idCounters[tableName] = 0;
  }
}
