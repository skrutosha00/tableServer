import express from "express";
import path from "path";

import getAction from "#root/functions/getAction.js";
import hasValidKey from "#root/utils/isCorrectKey.js";

import uploadTables from "#root/functions/uploadTables.js";
import restartPsibase from "#root/functions/restartPsibase.js";
import checkPsibase from "#root/functions/checkPsibase.js";

const app = express();

const port = process.env.PORT || 5000;

app.listen(port);
console.log("server started " + port);

app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.resolve("")));

app.get("/", (req, res) => {
  res.send("Server is working");
});

checkAndUpload();
setInterval(async () => {
  checkAndUpload();
}, process.env.UPLOAD_INTERVAL_IN_MINUTES * 60 * 1000);

async function checkAndUpload() {
  const serverIsWorking = await checkPsibase();
  if (!serverIsWorking) {
    await restartPsibase();
  }
  uploadTables();
}
