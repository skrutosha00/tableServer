import pushTransaction from "#root/functions/pushTransaction.js";

const userService = process.env.USER_SERVICE;

export async function addUsers(users) {
  users.forEach((user) => {
    const rows = ["glize_balance"];

    for (let row of rows) {
      if (user[row]) {
        user[row] *= 100;
      }
    }
  });

  const pushResult = await pushTransaction(userService, "addUsers", {
    json: JSON.stringify(users)
  });

  return pushResult;
}

export async function removeUsers(userIds) {
  const pushResult = await pushTransaction(userService, "removeUsers", {
    json: JSON.stringify(userIds)
  });

  return pushResult;
}

export async function removeAllUsers() {
  const pushResult = await pushTransaction(userService, "removeAllUsers");
  return pushResult;
}
