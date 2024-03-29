import { HttpResponse, HttpRequest, Controller, EmailValidator } from '../protocols'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-relper'
import { AddAccount } from '../../domain/usercases/add-account'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requeredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requeredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      this.addAccount.add({
        name,
        email,
        password
      })
    } catch {
      return serverError()
    }
  }
}
