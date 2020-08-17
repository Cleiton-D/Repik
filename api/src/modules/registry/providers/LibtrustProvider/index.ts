import { container } from 'tsyringe';

import ILibtrustProvider from './models/ILibtrustProvider';
import CryptoLibtrustProvider from './implementations/CryptoLibtrustProvider';

container.registerSingleton<ILibtrustProvider>(
  'LibtrustProvider',
  CryptoLibtrustProvider,
);
