import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const employeeSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  age: Joi.number().integer().min(18).required(),
  designation: Joi.string().required(),
  hiring_date: Joi.date().iso().required(),
  date_of_birth: Joi.date().iso().required(),
  salary: Joi.number().positive().required(),
});

export const attendanceSchema = Joi.object({
  employee_id: Joi.number().integer().positive().required(),
  date: Joi.date().iso().required(),
  check_in_time: Joi.string()
    .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .required()
    .messages({
      'string.pattern.base': 'check_in_time must be in HH:mm:ss format',
    }),
});
