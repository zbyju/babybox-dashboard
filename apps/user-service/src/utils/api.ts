export function ReturnOk(data: object) {
  return { data, metadata: { err: false, message: "Ok" } };
}

export function ReturnErr(message: string) {
  return { metadata: { err: true, message } };
}
