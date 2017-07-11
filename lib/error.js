const errorCodes = {
  SERVER_ISSUE: {
    code: 0,
    message: 'Server issue occurred',
  },
  MISSING_FIRST_NAME: {
    code: 100,
    message: 'Missing field "firstName"',
  },
  MISSING_LAST_NAME: {
    code: 101,
    message: 'Missing field "lastName"',
  },
  MISSING_PASSWORD: {
    code: 102,
    message: 'Missing field "password"',
  },
  MISSING_BIRTHDATE: {
    code: 103,
    message: 'Missing field "birthDate"',
  },
  MISSING_EMAIL: {
    code: 104,
    message: 'Missing email',
  },
  MISSING_ZIP: {
    code: 105,
    message: 'Missing ZIP Code',
  },
  MISSING_CITYID: {
    code: 106,
    message: 'Missing City Id',
  },
  MISSING_TOKEN: {
    code: 107,
    message: 'Missing Token',
  },
  MISSING_LINKEDIN_ID: {
    code: 108,
    message: 'Missing linkedin Id',
  },
  MISSING_INVITED_BY: {
    code: 109,
    message: 'Missing invitedBy',
  },
  MISSING_USERNAME: {
    code: 110,
    message: 'Missing field "username"',
  },
  USER_EMAIL_TAKEN: {
    code: 200,
    message: 'Email already taken',
  },
  USER_NOT_FOUND: {
    code: 201,
    message: 'User was not found',
  },
  USER_INVALID_CREDENTIALS: {
    code: 202,
    message: 'Invalid credentials were provided',
  },
  USER_INVALID_EMAIL: {
    code: 203,
    message: 'Invalid email provided',
  },
  USER_INVALID_BIRTHDATE: {
    code: 204,
    message: 'Invalid date of birth was provided',
  },
  USER_RESET_TOKEN_NOT_FOUND: {
    code: 205,
    message: 'User reset token not found',
  },
  JWT_MISSING_HEADER: {
    code: 300,
    message: 'Missing authorization header',
  },
  JWT_INVALID_HEADER: {
    code: 301,
    message: 'Invalid authorization header'
  },
  JWT_INVALID: {
    code: 302,
    message: 'Invalid JWT token',
  },
  JWT_UNAUTHORIZED: {
    code: 303,
    message: 'Token does not belong to a user',
  },
};

module.exports = {
  errorCodes,
};
