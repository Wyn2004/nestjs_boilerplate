export enum ErrorCode {
  // Common Validation
  V000 = 'common.validation.error',
  V003 = 'common.validation.is_invalid_string',
  V004 = 'common.validation.is_not_empty',
  V005 = 'common.validation.is_invalid_date_format',
  V006 = 'common.validation.is_invalid_time_format',
  V007 = 'common.validation.is_invalid_phone_number',
  // Validation
  V001 = 'user.validation.is_invalid_email',
  V002 = 'user.validation.is_invalid_password',
}
