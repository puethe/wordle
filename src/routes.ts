import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import {
  CheckWordUseCase,
  IStorageAdapter,
  ReplaceAnswerUseCase,
} from './domain';
import { CustomError, ErrorCode } from './error';
import { FileSystemAdapter, HardcodedAdapter } from './adapters';

const HTTP_BAD_REQUEST = 400;
const HTTP_INTERNAL_SERVER_ERROR = 500;

const mapErrorCode = (domainErrorCode: ErrorCode) => {
  switch (domainErrorCode) {
    case ErrorCode.BAD_REQUEST:
      return HTTP_BAD_REQUEST;
    default:
      return HTTP_INTERNAL_SERVER_ERROR;
  }
};

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  // Handled errors
  if (err instanceof CustomError) {
    res
      .status(mapErrorCode(err.statusCode))
      .json({ errors: [{ message: err.message }] });
    return;
  }

  // Unhandled errors
  res
    .status(HTTP_INTERNAL_SERVER_ERROR)
    .json({ errors: [{ message: 'Something went wrong' }] });
  return;
};

export const router = Router();

router.get('/play', (req: Request, res: Response) => {
  const guess = req.query.guess!.toString();
  const adapter = makeStorageAdapterFromEnv();
  const uc = new CheckWordUseCase(adapter);
  const result = uc.execute(guess);
  res.json(result);
});

router.post('/change-answer', (req: Request, res: Response) => {
  const newAnswer = req.body.newAnswer!.toString();
  const adapter = makeStorageAdapterFromEnv();
  const uc = new ReplaceAnswerUseCase(adapter);
  uc.execute(newAnswer);
  res.json();
});

const makeStorageAdapterFromEnv = (): IStorageAdapter => {
  if (process.env.STORAGE_TYPE === 'hardcoded') {
    return new HardcodedAdapter();
  } else {
    return new FileSystemAdapter(process.env.INPUT_FILE || '');
  }
};
