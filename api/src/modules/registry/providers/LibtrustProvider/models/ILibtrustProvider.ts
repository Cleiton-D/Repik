export default interface ILibtrustProvider {
  generateKid(key: Buffer): Promise<string | undefined>;
}
