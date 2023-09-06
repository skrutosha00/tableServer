export default async function checkPsibase() {
  try {
    let response = await fetch(`https://${process.env.PSIBASE_DOMAIN}`);
    return response.ok;
  } catch (err) {
    console.log(err);
    return false;
  }
}
