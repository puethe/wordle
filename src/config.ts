import { CustomError } from './error';

type StorageType = 'hardcoded' | 'filesystem';
type Config = {
  storageType: StorageType;
  inputFile: string;
};

export const CONFIG: Config = {
  storageType: 'hardcoded',
  inputFile: '',
};

function isStorageType(str: string): str is StorageType {
  return ['hardcoded', 'filesystem'].includes(str);
}

export const loadConfig = () => {
  const storageType = process.env.STORAGE_TYPE;
  if (storageType) {
    if (isStorageType(storageType)) {
      CONFIG.storageType = storageType;
    } else {
      throw new CustomError({
        message: `Env variable STORAGE_TYPE has invalid value ${storageType}`,
      });
    }
  }

  if (CONFIG.storageType === 'filesystem') {
    const inputFile = process.env.INPUT_FILE;
    if (inputFile) {
      CONFIG.inputFile = inputFile;
    } else {
      throw new CustomError({
        message:
          'Env variable INPUT_FILE is required when using STORAGE_TYPE=filesystem',
      });
    }
  }
};
