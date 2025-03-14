import Joi from 'joi'

const cleanCnpj = (cnpj: string) => cnpj.replace(/\D/g, '')

export const resaleSchema = Joi.object({
  cnpj: Joi.string()
    .required()
    .custom((value, helpers) => {
      const cleanedCnpj = cleanCnpj(value)
      if (cleanedCnpj.length !== 14) {
        return helpers.message({ custom: 'CNPJ must be exactly 14 digits.' })
      }
      return cleanedCnpj
    })
    .length(14)
    .messages({
      'string.length': 'CNPJ must have exactly 14 digits.',
      'any.required': 'CNPJ is required.',
    }),

  corporateName: Joi.string().required().min(3).max(255).messages({
    'any.required': 'Corporate name is required.',
    'string.min': 'Corporate name must be at least 3 characters long.',
    'string.max': 'Corporate name must not exceed 255 characters.',
  }),

  tradeName: Joi.string().required().min(3).max(255).messages({
    'any.required': 'Trade name is required.',
    'string.min': 'Trade name must be at least 3 characters long.',
    'string.max': 'Trade name must not exceed 255 characters.',
  }),

  email: Joi.string().email().required().messages({
    'any.required': 'Email is required.',
    'string.email': 'Invalid email format.',
  }),

  phones: Joi.array().items(Joi.string().min(10).max(15)).optional().messages({
    'array.base': 'Phones must be an array of strings.',
    'string.min': 'Phone number must have at least 10 digits.',
    'string.max': 'Phone number must not exceed 15 digits.',
  }),

  contacts: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          'any.required': 'Contact name is required.',
        }),
        isPrimary: Joi.boolean().required().messages({
          'any.required': 'isPrimary field is required.',
        }),
      })
    )
    .required()
    .messages({
      'any.required': 'At least one contact is required.',
      'array.base': 'Contacts must be an array of objects.',
    })
    .custom((contacts, helpers) => {
      const hasPrimary = contacts.some(
        (contact: { isPrimary: boolean }) => contact.isPrimary
      )
      if (!hasPrimary) {
        return helpers.message({
          custom: 'At least one contact must be marked as primary.',
        })
      }
      return contacts
    }),

  deliveryAddresses: Joi.array()
    .items(Joi.string().required())
    .required()
    .min(1)
    .messages({
      'array.min': 'At least one delivery address is required.',
      'any.required': 'Delivery addresses are required.',
    }),
})
