export type HttpResponse = {
  [key: string]: unknown
  statusCode?: number
  error?: HttpResponseError
}

export type HttpResponseError = {
  code: number
  message: {
    type: string
    value: string
  }
}
