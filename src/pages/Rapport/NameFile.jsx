const returnMois = (chiffre) => {
  if (chiffre === 0) {
    return 'Janvier';
  }
  if (chiffre === 1) {
    return 'Février';
  }
  if (chiffre === 2) {
    return 'Mars';
  }
  if (chiffre === 3) {
    return 'Avril';
  }
  if (chiffre === 4) {
    return 'Mai';
  }
  if (chiffre === 5) {
    return 'Juin';
  }
  if (chiffre === 6) {
    return 'Juillet';
  }
  if (chiffre === 7) {
    return 'Aout';
  }
  if (chiffre === 8) {
    return 'Septembre';
  }
  if (chiffre === 9) {
    return 'Octobre';
  }
  if (chiffre === 10) {
    return 'Novembre';
  }
  if (chiffre === 12) {
    return 'Décembre';
  }
};

module.exports = {
  generateNomFile: (dates, texte) => {
    try {
      if (dates.debut !== '' && dates.fin !== '') {
        let date1 = new Date(dates.debut);
        let date2 = new Date(dates.fin);
        if (date1.getFullYear() === date2.getFullYear()) {
          if (date1.getMonth() == date2.getMonth()) {
            if (date1.getDate() === date2.getDate()) {
              return `${texte} du ${date2.getDate()} ${returnMois(date2.getMonth())} ${date2.getFullYear()}`;
            } else {
              return `${texte} allant du ${date1.getDate()} au ${date2.getDate()} ${returnMois(date2.getMonth())} ${date2.getFullYear()}`;
            }
          } else {
            return `${texte} allant du ${date1.getDate()} ${returnMois(date1.getMonth())} au ${date2.getDate()} ${returnMois(
              date2.getMonth()
            )} ${date2.getFullYear()}`;
          }
        } else {
          return `${texte} allant du ${date1.getDate()} ${returnMois(
            date1.getMonth()
          )} ${date1.getFullYear()} au ${date2.getDate()} ${returnMois(date2.getMonth())} ${date2.getFullYear()}`;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
};
