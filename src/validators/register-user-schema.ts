import * as yup from 'yup';

const PASSWORD_REGEX = /^[a-zA-Z0-9]{8,}$/;

export const registerUserSchema = yup
  .object({
    username: yup.string().trim().min(2).max(50),
    password: yup.string().matches(PASSWORD_REGEX, 'password must contain only letters and numbers with a minimum of 8 characters')
  })
  .required();
