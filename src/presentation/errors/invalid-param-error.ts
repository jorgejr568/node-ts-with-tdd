export class InvalidParamError extends Error {
  private readonly param: string

  constructor (paramName: string) {
    super(`Invalid param: ${paramName}`)
    this.name = 'InvalidParamError'
    this.param = paramName
  }
}
