import { CustomError } from './error';

type StorageType = 'hardcoded' | 'filesystem' | 'database';
type Config = {
  storageType: StorageType;
  inputFile: string;
  databaseUrl: string;
};

export const CONFIG: Config = {
  storageType: 'hardcoded',
  inputFile: '',
  databaseUrl: '',
};

function isStorageType(str: string): str is StorageType {
  return ['hardcoded', 'filesystem', 'database'].includes(str);
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

  switch (CONFIG.storageType) {
    case 'filesystem': {
      const inputFile = process.env.INPUT_FILE;
      if (inputFile) {
        CONFIG.inputFile = inputFile;
      } else {
        throw new CustomError({
          message:
            'Env variable INPUT_FILE is required when using STORAGE_TYPE=filesystem',
        });
      }
      break;
    }
    case 'database': {
      const dbUrl = process.env.DATABASE_URL;
      if (dbUrl) {
        CONFIG.databaseUrl = dbUrl;
      } else {
        throw new CustomError({
          message:
            'Env variable DATABASE_URL is required when using STORAGE_TYPE=database',
        });
      }
      break;
    }
    case 'hardcoded': {
      break;
    }
  }
};
