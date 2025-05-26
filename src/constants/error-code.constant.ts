export enum ErrorCode {
  // Common Validation
  V000 = 'common.validation.error',
  V001 = 'common.validation.is_invalid_email',
  V002 = 'common.validation.is_invalid_password',
  V003 = 'common.validation.is_invalid_string',
  V004 = 'common.validation.is_not_empty',
  V005 = 'common.validation.is_invalid_date_format',
  V006 = 'common.validation.is_invalid_time_format',
  V007 = 'common.validation.is_invalid_phone_number',

  // Validation User || Auth
  U001 = 'user.validation.is_invalid_email',
  U002 = 'user.validation.is_invalid_password',
  U003 = 'user.validation.not_found',
  U004 = 'user.validation.is_invalid_email_or_password',
  U005 = 'user.validation.email_already_exists',
}
