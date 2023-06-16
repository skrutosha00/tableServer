const key = "1234";

export default function hasValidKey(body) {
  return body?.data?.key === key;
}
