interface StatusCode {
  title?: string;
  code: number;
}

class RegistryError {
  public readonly message: string;

  public readonly statusCode: StatusCode;

  constructor(message: string, { title = 'error', code }: StatusCode) {
    this.message = message;
    this.statusCode = { title, code };
  }
}

export default RegistryError;
