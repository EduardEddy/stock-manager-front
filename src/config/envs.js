// config/envs.js
require('dotenv').config(); // Cargar las variables del .env
const Joi = require('joi');

// Definir el esquema de validación
const envVarsSchema = Joi.object({
  API_SERVER: Joi.string().required()
}).unknown(); // Permitir otras variables no definidas

// Validar process.env
const { error, value: envVars } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Exportar las variables de entorno validadas
module.exports = {
  apiServer: envVars.API_SERVER,
};
