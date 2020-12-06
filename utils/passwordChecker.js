'use strict';

export default function(password) {
  const lengthRequirement = 8;

  if (!password || password.length < lengthRequirement) {
    return 'Password needs to be at least eight characters long.';
  }

  const rules = [
    {
      pattern: RegExp(/\d/),
      message: 'Password needs to have at least one number.',
    },
    {
      pattern: RegExp(/[a-z]/),
      message: 'Password needs to have at least one lower case letter.',
    },
    {
      pattern: RegExp(/[A-Z]/),
      message: 'Password needs to have at least one upper case letter.',
    },
  ];

  for (let i = 0; i < rules.length; ++i) {
    if (!rules[i].pattern.test(password)) {
      return rules[i].message;
    }
  }

  return null;
}
;
