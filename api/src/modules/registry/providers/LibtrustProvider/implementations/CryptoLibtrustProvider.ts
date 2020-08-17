import crypto from 'crypto';
import base32 from 'hi-base32';

import ILibtrustProvider from '../models/ILibtrustProvider';

export default class CryptoLibtrustProvider implements ILibtrustProvider {
  public async generateKid(key: Buffer): Promise<string | undefined> {
    const publicKey = crypto.createPublicKey(key);
    const publicDer = publicKey.export({ type: 'spki', format: 'der' });

    const hash = crypto.createHash('sha256').update(publicDer).digest('hex');
    const buffer = Buffer.from(hash, 'hex').slice(0, 30);

    const keyId = base32
      .encode(buffer)
      .match(/.{1,4}/g)
      ?.join(':');

    return keyId;
  }
}
