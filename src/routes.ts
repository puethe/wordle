import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import { CheckWordUseCase } from './domain';
import { CustomError, ErrorCode } from './error';
import { HardcodedAdapter } from './adapters';

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
      .send({ errors: [{ message: err.message }] });
  }

  // Unhandled errors
  res
    .status(HTTP_INTERNAL_SERVER_ERROR)
    .send({ errors: [{ message: 'Something went wrong' }] });
};

export const router = Router();

router.get('/api', (req: Request, res: Response) => {
  const guess = req.query.guess!.toString();
  const adapter = new HardcodedAdapter();
  const uc = new CheckWordUseCase(adapter);
  const result = uc.execute(guess);
  res.json(result);
});
