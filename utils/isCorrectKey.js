export default function hasValidKey(body) {
  return body?.data?.key === process.env.KEY;
}
