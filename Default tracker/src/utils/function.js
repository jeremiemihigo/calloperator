import lodash from 'lodash';

export const returnRole = (roles, idRole) => {
  return lodash.filter(roles, { idRole })[0]?.title.toUpperCase();
};
export const returnFeedback = (feedback, id, champs) => {
  const chmp = champs ? champs : 'title';
  if (feedback && feedback?.length > 0) {
    if (lodash.filter(feedback, { idFeedback: id }).length > 0) {
      return lodash.filter(feedback, { idFeedback: id })[0]['' + chmp];
    } else {
      return id;
    }
  }
};
export const returnVisited = (visites, mois) => {
  if (visites.length > 0) {
    if (visites.filter((x) => x.demande.lot === mois).length > 0) {
      return visites.filter((x) => x.demande.lot === mois)[0]?.demande?.raison;
    } else {
      return 'no_visits';
    }
  } else {
    return 'no_visits';
  }
};
export const returnMoisLetter = (month) => {
  let main;
  switch (month) {
    case '01':
      main = 'Jan ';
      break;
    case '02':
      main = 'Feb ';
      break;
    case '03':
      main = 'Mar ';
      break;
    case '04':
      main = 'Apr ';
      break;
    case '05':
      main = 'May ';
      break;
    case '06':
      main = 'Jun ';
      break;
    case '07':
      main = 'Jul';
      break;
    case '08':
      main = 'Aug ';
      break;
    case '09':
      main = 'Sep ';
      break;
    case '10':
      main = 'Oct ';
      break;
    case '11':
      main = 'Nov ';
      break;
    case '12':
      main = 'Dec ';
      break;
    default:
      main = 'Invalid month';
      break;
  }
  return main;
};
export const returnSLANumber = (client, type) => {
  let nombre = 0;
  return nombre;
};
export const structuration = (client, cle) => {
  const key = Object.keys(lodash.groupBy(client, '' + cle));
  return key;
};
export const retournForTeam = (client, feedback) => {
  return client.filter((x) => x.currentFeedback === feedback);
};
export const responsive = (taille, type, title) => {
  if (taille === 1) {
    if (title === 'title') return 12;
    if (type === 'lg') {
      if (title === 'subtitle') return 12;
    }
    if (type === 'md') {
      if (title === 'subtitle') return 4;
    }
  }
  if (taille === 2) {
    if (title === 'title') return 6;
    if (type === 'lg') {
      if (title === 'subtitle') return 6;
    }
    if (type === 'md') {
      if (title === 'subtitle') return 6;
    }
  }
  if (taille === 3) {
    if (title === 'title') return 4;
    if (type === 'lg') {
      if (title === 'subtitle') return 6;
    }
    if (type === 'md') {
      if (title === 'subtitle') return 6;
    }
  }
  if (taille === 4) {
    if (title === 'title') return 3;
    if (type === 'lg') {
      if (title === 'subtitle') return 12;
    }
    if (type === 'md') {
      if (title === 'subtitle') return 12;
    }
  }
  if (taille === 5) {
    if (title === 'title') return 2;
    if (type === 'lg') {
      if (title === 'subtitle') return 12;
    }
    if (type === 'md') {
      if (title === 'subtitle') return 12;
    }
  }
  if (taille > 5) {
    if (title === 'title') return 2;
    if (type === 'lg') {
      if (title === 'subtitle') return 12;
    }
    if (type === 'md') {
      if (title === 'subtitle') return 12;
    }
  }
};
function getFormattedDate(dates) {
  const date = new Date(dates);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
export const sla = (index, delai) => {
  const dateDifferenceInHours = (dateInitial, dateFinal) => (dateFinal - dateInitial) / 3600000;
  const diff = dateDifferenceInHours(new Date(getFormattedDate(index.dateupdate)), new Date(getFormattedDate(new Date())));
  let delai_value = parseInt(delai) * 24;
  return diff > delai_value ? 'OUT SLA' : 'IN SLA';
};
export const par = [
  { id: 0, title: 'PAR 30', value: 'PAR 30' },
  { id: 1, title: 'PAR 60', value: 'PAR 60' },
  { id: 2, title: 'PAR 90', value: 'PAR 90' },
  { id: 3, title: 'PAR 120', value: 'PAR 120' },
  { id: 4, title: 'Overall' }
];
export const retourneRole = (idFeedback, feedback, roles) => {
  const feed = lodash.filter(feedback, { idFeedback });

  if (feed.length > 0) {
    let concerne = roles.filter((x) => feed[0].idRole?.includes(x.idRole));
    if (concerne.length > 0) {
      let titler = concerne.map(function (x) {
        return x.title;
      });
      return titler.join(' and ');
    } else {
      return '';
    }
  } else {
    return '';
  }
};
