module.exports = {
  generateString: (length) => {
    const caractere = "123456789ABCDEFGHIJKLMNPRSTUVWXYZ";
    let resultat = "";
    let caractereLength = caractere.length;
    for (let i = 0; i < length; i++) {
      resultat += caractere.charAt(Math.floor(Math.random() * caractereLength));
    }
    return resultat;
  },
  differenceDays: (date1, date2) => {
    let resultat =
      (new Date(date2).getTime() - new Date(date1).getTime()) / 86400000;
    return resultat.toFixed(0);
  },
  generateNumber: (length) => {
    const caractere = "1234567890";
    let resultat = "";
    let caractereLength = caractere.length;
    for (let i = 0; i < length; i++) {
      resultat += caractere.charAt(Math.floor(Math.random() * caractereLength));
    }
    return resultat;
  },
};
