const Joi = require('joi');

require('dotenv').config();

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow('development', 'production')
        .default('development'),
    PORT: Joi.number().default(5000),
    JWT_SECRET: Joi.string()
        .required()
        .description('JWT Secret required to sign'),
    MONGODB_URL: Joi.string().required().description('Mongo DB host url'),
})
    .unknown()
    .required();

const { error } = envVarsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
