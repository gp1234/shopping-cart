export function generateMockJWT(payload: object) {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.`;
}

export function decodeMockJWT(token: string) {
  try {
    const [, body] = token.split('.')
    if (!body) return null
    return JSON.parse(atob(body))
  } catch {
    return null
  }
}
