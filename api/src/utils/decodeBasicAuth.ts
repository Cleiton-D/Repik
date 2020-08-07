interface BasicAuth {
  username: string;
  password: string;
}

export default function decodeBasicAuth(token: string): BasicAuth {
  try {
    const authorizationDecoded = Buffer.from(
      token.split(' ')[1],
      'base64',
    ).toString('utf-8');

    const [user, pass] = authorizationDecoded.split(':');

    return { username: user, password: pass };
  } catch {
    throw new Error('Invalid authorization parameters');
  }
}
