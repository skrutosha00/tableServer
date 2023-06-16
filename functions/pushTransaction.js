import {
  getTaposForHeadBlock,
  signAndPushTransaction
} from "#root/libraries/rpc.mjs";

const privateKeys = [process.env.PRIVATE_KEY];

export default async function pushTransaction(
  service,
  method,
  data,
  keys = privateKeys
) {
  const baseUrl = `https://${service}.${process.env.PSIBASE_DOMAIN}.com`;

  const transaction = {
    tapos: {
      ...(await getTaposForHeadBlock(baseUrl)),
      expiration: new Date(Date.now() + 100 * 1000)
    },
    actions: [
      {
        sender: process.env.PSIBASE_ACCOUNT,
        service,
        method,
        data
      }
    ]
  };

  try {
    const trace = await signAndPushTransaction(baseUrl, transaction, keys);

    return "OK";
  } catch (e) {
    console.error(e);

    addMsg("");
    addMsg(e.message);
    if (e.trace) {
      addMsg("");
      addMsg("trace: " + JSON.stringify(e.trace, null, 4));
    }

    return e.message;
  }
}

function addMsg(info) {
  console.log(info);
}
