import pushTransaction from "#root/functions/pushTransaction.js";

const userService = process.env.USER_SERVICE;

export async function addUsers(users) {
  users.forEach((user) => {
    let rows = ["umi_balance", "glize_balance"];

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
  const dataSource = `https://${userService}.royfractal.com/graphql?query={user_rows{edges{node{id}}}}`;

  const fetchedIds = await fetch(dataSource)
    .then((data) => data.json())
    .then((data) => {
      const ids = [];

      data.data.user_rows.edges.forEach((edge) => {
        ids.push(+edge.node.id);
      });

      return ids;
    });

  if (!fetchedIds) {
    return "Failed to fetch users";
  }

  console.log(fetchedIds);

  const pushResult = await pushTransaction(userService, "removeUsers", {
    json: JSON.stringify(fetchedIds)
  });

  return pushResult;
}
