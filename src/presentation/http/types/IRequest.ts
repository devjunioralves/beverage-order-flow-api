export interface IRequest {
  body: { [parameter: string]: unknown }
  params: { [parameter: string]: string }
  query: { [parameter: string]: unknown }
  headers: { [parameter: string]: unknown }
}
