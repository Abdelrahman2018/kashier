import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);
const secretKey = `${process.env.CRYPTO_SECRET}`;

const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

const decrypt = (hash: string, iv: string) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, 'hex')
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
};

export const Crypto = {
  encrypt,
  decrypt,
};
