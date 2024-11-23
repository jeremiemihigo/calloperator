import lodash from 'lodash';

export const returnRole = (roles, idRole) => {
  if (roles.length > 0) {
    return lodash.filter(roles, { idRole })[0]?.title.toUpperCase();
  } else {
    return idRole;
  }
};
