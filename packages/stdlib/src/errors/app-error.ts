import type { Constructor } from 'type-fest'

export function isError(err?: unknown): err is Error {
  return err != null && typeof err === 'object' && 'name' in err && 'message' in err
}

export function isNodeError(err: unknown | undefined, code: string): boolean {
  return err != null && typeof err === 'object' && 'code' in err && err.code === code
}

export type GenericError = {
  statusCode: number
  code: string
  title: string
  message: string
}

export const isGenericError = (err: unknown): err is GenericError => {
  return (
    err != null && typeof err === 'object' && 'statusCode' in err && 'code' in err && 'title' in err && 'message' in err
  )
}

export interface RenderableError {
  render(): GenericError

  getOriginalError(): unknown
}

export function isRenderableError(error: unknown): error is RenderableError {
  return error != null && typeof error === 'object' && 'render' in error
}

export interface AppErrorOptions {
  httpStatusCode: number
  title?: string
  message: string
  resource?: string
  originalError?: unknown
  metadata?: Record<string, unknown>
}

export class AppError extends Error implements RenderableError {
  httpStatusCode: number
  originalError: unknown
  resource?: string
  title?: string
  metadata?: Record<string, unknown>

  constructor(options: AppErrorOptions) {
    super(options.message)
    this.httpStatusCode = options.httpStatusCode
    this.message = options.message
    this.originalError = options.originalError
    this.resource = options.resource
    this.title = options.title
    this.metadata = options.metadata
  }

  get code(): string {
    return this.name
  }

  withMetadata(metadata: Record<string, unknown>) {
    this.metadata = metadata
    return this
  }

  render() {
    return {
      statusCode: this.httpStatusCode,
      code: this.code,
      title: this.title || 'Something went wrong ¯\\_(ツ)_/¯',
      message: this.message,
    }
  }

  getOriginalError() {
    return this.originalError
  }
}

export function isAppError(factory: Constructor<AppError>, err: unknown): err is AppError {
  return err instanceof AppError && err.code === factory.name
}
