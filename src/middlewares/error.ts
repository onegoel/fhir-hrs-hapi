import {type HttpError, isHttpError} from 'http-errors';
import {
  type Request,
  type Response,
  type NextFunction,
  type ErrorRequestHandler,
  response,
} from 'express';
import {config} from 'dotenv';

const errorHandler: ErrorRequestHandler = (
  error: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  if (res.headersSent) {
    next(error);
  }

  // console.log(error)

  switch (true) {
    case isHttpError(error):
      return res
        .status((error as HttpError).statusCode)
        .json({message: error.message});
    case typeof error.response !== undefined:
      return res
        .status(error.response.status)
        .json({message: error.response.data});
    default:
      return res.status(500).json({
        message:
          'Internal Server Error: Something went wrong. Please try again later.',
      });
  }
};

export default errorHandler;
