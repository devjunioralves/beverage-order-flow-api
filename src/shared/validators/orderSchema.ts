import Joi from 'joi'

export const orderSchema = Joi.object({
  resaleId: Joi.string().uuid().required().messages({
    'any.required': 'Resale ID is required.',
    'string.uuid': 'Resale ID must be a valid UUID.',
  }),
  customerId: Joi.string().uuid().required().messages({
    'any.required': 'Customer ID is required.',
    'string.uuid': 'Customer ID must be a valid UUID.',
  }),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required().messages({
          'any.required': 'Product ID is required.',
        }),
        quantity: Joi.number().integer().positive().required().messages({
          'any.required': 'Quantity is required.',
          'number.positive': 'Quantity must be a positive number.',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'An order must have at least one item.',
      'any.required': 'Order items are required.',
    }),
})
