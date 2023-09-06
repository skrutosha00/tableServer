import { NodeSSH } from "node-ssh";

const ssh = new NodeSSH();

export default async function restartPsibase() {
  try {
    await ssh.connect({ host: process.env.PSIBASE_HOST, username: "root", password: process.env.PSIBASE_PASSWORD });
    await ssh.execCommand("psinode dbr");
  } catch (err) {
    console.log(err);
  }
}
