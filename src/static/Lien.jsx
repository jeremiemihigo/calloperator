// eslint-disable-next-line no-undef
export const lien = 'https://bboxxbackendtest.onrender.com/bboxx/support';
export const lien_image = 'https://bboxxbackendtest.onrender.com/bboxx/image';
export const lien_conge = 'https://bboxxbackendtest.onrender.com/admin/conge';
// export const lien = 'http://localhost:5000/bboxx/support';
// export const lien_conge = 'http://localhost:5000/admin/conge';
// export const lien_image = 'http://localhost:5000/bboxx/image';
export const config = {
  headers: {
    'Content-Type': 'Application/json',
    Authorization: 'Bearer ' + localStorage.getItem('auth')
  }
};

export const isEmpty = (value) => {
  if (
    value === undefined ||
    value === null ||
    value == [] ||
    value.length === 0 ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  ) {
    return true;
  } else {
    return false;
  }
};

export const dateFrancais = (donner) => {
  let dates = new Date(donner);
  return `${dates.getDate()}/${dates.getMonth() + 1}/${dates.getFullYear()}`;
};
