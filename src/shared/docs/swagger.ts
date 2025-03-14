import { Express } from 'express'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Beverage Order Flow API',
    version: '1.0.0',
    description: 'API for managing beverage orders and resale operations',
  },
  servers: [
    {
      url: 'http://localhost/api',
      description: 'Local server',
    },
  ],
}

const options = {
  swaggerDefinition,
  apis: ['./src/shared/docs/*.yaml'],
}

const swaggerSpec = swaggerJSDoc(options)

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

const yamlDoc = yaml.dump(swaggerSpec)
fs.writeFileSync('./src/shared/docs/swagger.yaml', yamlDoc)
