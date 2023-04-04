export interface Error extends globalThis.Error {
  statusCode?: number;
  data?: Object[];
}

const errorInitializer: (
  error: string | Error,
  statusCode?: number,
  errorData?: any
) => Error = (error, statusCode, errorData) => {
  const newError: Error = typeof error === "string" ? new Error(error) : error;
  if (statusCode) newError.statusCode = statusCode;
  if (!newError.statusCode) newError.statusCode = 500;
  if (errorData) newError.data = errorData;
  return newError;
};

export default errorInitializer;
