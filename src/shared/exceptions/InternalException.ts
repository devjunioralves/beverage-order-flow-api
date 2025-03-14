import { BaseError } from '@shared/exceptions/BaseError'

export class InternalException extends BaseError {
	constructor(message: string) {
		super({ message, name: 'InternalException', statusCode: 500 })
	}
}
