import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-relper'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requeredFields = ['name', 'email', 'password']
    for (const field of requeredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
