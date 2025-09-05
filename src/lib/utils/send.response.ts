import { NextResponse } from "next/server";

export interface ISendResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T | null;
  meta?: {
    page?: number;
    limit?: number;
    totalPages?: number;
    total?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

/**
 * The function `sendResponse` in TypeScript is used to send a JSON response with status code, message,
 * success status, data, and optional meta information.
 * @param  - The `sendResponse` function takes in an object of type `ISendResponse<T>` with the
 * following parameters:
 * @returns The `sendResponse` function is returning a JSON response using `NextResponse.json`. The
 * response includes the `success`, `message`, and `data` properties. If the `meta` property is
 * available, it is also included in the response. The status code of the response is set to the
 * provided `statusCode`.
 */
export const sendResponse = <T>({
  statusCode,
  message,
  success,
  data,
  meta,
}: ISendResponse<T>) => {
  return NextResponse.json(
    {
      success,
      message,
      data,
      ...(meta ? { meta } : {}),
    },
    { status: statusCode }
  );
};
export interface IErrorResponse {
  success: boolean;
  message: string;
  errorCode: string;
  errors: Record<string, any> | null;
}

/**
 * The `throwAppError` function in TypeScript is used to return a JSON response with an error message
 * and status code.
 * @param {IErrorResponse} error - The `error` parameter is of type `IErrorResponse`, which likely
 * represents an error response object containing information about the error that occurred. This
 * object may include properties such as an error message, error code, and any additional details
 * related to the error.
 * @param {number} [statusCode=400] - The `statusCode` parameter in the `throwAppError` function is
 * used to specify the HTTP status code that will be returned in the response. By default, it is set to
 * 400 (Bad Request), but you can provide a different status code when calling the function if needed.
 * @returns The `throwAppError` function is returning a JSON response with the error object and a
 * specified status code.
 */
export const throwAppError = (
  error: IErrorResponse,
  statusCode: number = 400
) => {
  return NextResponse.json<IErrorResponse>(error, { status: statusCode });
};
