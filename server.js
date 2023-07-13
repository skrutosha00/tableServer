import express from "express";
import path from "path";

import getAction from "#root/functions/getAction.js";
import hasValidKey from "#root/utils/isCorrectKey.js";

import uploadTables from "#root/functions/uploadTables.js";

const app = express();

const port = process.env.PORT || 5000;

app.listen(port);
console.log("server started " + port);

app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.resolve("")));

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.post("/:action", async (req, res) => {
  if (!hasValidKey(req.body)) {
    res.status(403).send("Invalid key");
    return;
  }

  const { actionFunction, actionParam } = getAction(
    req.params.action,
    req.body
  );

  const pushResult = await actionFunction(actionParam);

  let status = 200;

  if (pushResult == "There is no such method") {
    status = 404;
  } else if (pushResult != "OK") {
    status = 500;
  }

  res.status(status).send(pushResult);
});

setInterval(async () => {
  uploadTables();
}, 10 * 60 * 1000);
