// eslint-disable-next-line no-undef

const link = "https://visitemenagesbackend.bboxxvm.com";
const link_big = "https://visitemenagesbackend.bboxxvm.com";
//const link_big = "http://localhost:5000";
//const link = "http://localhost:5000";
export const puls_img =
  "https://pulse.bboxx.com/v2/assets/animations/loader.gif";

export const lien = `${link}/bboxx/support`;
export const big_data = `${link}/bboxx/support`;
export const lien_socket = link;
export const lien_conge = `${link}/admin/conge`;
export const lien_issue = `${link}/issue`;
export const portofolio = `${link}/bboxx/portofolio`;
export const big_data_issue = `${link_big}/issue`;
export const lien_servey = `${link}/servey`;
export const lien_image = `${link}/bboxx/image`;
export const lien_dt = `${link_big}/dt`;
export const lien_file = `${link}/bboxx/file`;
export const lien_terrain = `${link}/bboxx/terrain`;
export const config = {
  headers: {
    "Content-Type": "Application/json",
    Authorization: "Bearer " + localStorage.getItem("auth"),
  },
};

export const isEmpty = (value) => {
  if (
    value === undefined ||
    value === null ||
    value == [] ||
    value.length === 0 ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
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

export const returnDelai = async (statut, deedline, today) => {
  if (deedline && today) {
    const a = _.filter(deedline, { plainte: statut });
    if (a.length > 0) {
      //si la plainte existe je cherche le jour
      let critere = a[0].critere.filter((x) => x.jour === today.day_of_week);
      if (critere.length > 0) {
        //si le critere existe
        let debutHeure = critere[0].debut.split(":")[0];
        let debutMinutes = critere[0].debut.split(":")[1];
        if (
          new Date(today.datetime).getHours() > parseInt(debutHeure) ||
          (new Date(today.datetime).getHours() === parseInt(debutHeure) &&
            new Date(today.datetime).getMinutes() >= parseInt(debutMinutes))
        ) {
          return critere[0]?.delai;
        } else {
          return a[0]?.defaut;
        }
      } else {
        return a[0]?.defaut;
      }
    } else {
      return 0;
    }
  }
};
import React from "react";
export function TimeCounter(durationInMinutes) {
  const [remainingTimeInSeconds, setRemainingTimeInSeconds] = React.useState(
    durationInMinutes * 60
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTimeInSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    // Nettoyage du timer à la fin
    return () => clearInterval(interval);
  }, []);

  if (remainingTimeInSeconds <= 0) {
    return (
      <p
        style={{
          background: "red",
          padding: "0px",
          margin: "0px",
          height: "50%",
          fontSize: "12px",
          color: "white",
          width: "100%",
          display: "flex",
          alignItems: "center",
          borderRadius: "5px",
          justifyContent: "center",
        }}
      >
        OUT SLA
      </p>
    );
  } else {
    const days = Math.floor(remainingTimeInSeconds / (24 * 3600));
    const hours = Math.floor((remainingTimeInSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
    const seconds = remainingTimeInSeconds % 60;
    return (
      <p
        style={{
          background: "green",
          padding: "0px",
          borderRadius: "10px",
          margin: "0px",
          height: "50%",
          fontSize: "12px",
          color: "white",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >{`
      ${days + "jr"} ${hours + "h"} ${minutes + "m"} ${seconds + "s"}
      `}</p>
    );
  }
}
// Exemple d'utilisation

export const returnTime = (date1, date2) => {
  //Date 2 : Date à jour
  //Date 1 : Date à tester
  let resultat =
    (new Date(date2).getTime() - new Date(date1).getTime()) / 60000;
  if (resultat < 1) {
    return 1;
  } else {
    return resultat;
  }
};
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export const returnName = (nom) => {
  if (nom) {
    const split = nom.split(" ");
    return nom.split(" ")[split.length - 1];
  } else {
    return "";
  }
};
export function TimeCounterTechnique(row) {
  let minutes =
    row.time_delai - returnTime(row.fullDateSave, new Date()).toFixed(0);

  const [remainingTimeInSeconds, setRemainingTimeInSeconds] = React.useState(
    minutes * 60
  );
  React.useEffect(() => {
    const intervals = setInterval(() => {
      setRemainingTimeInSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    // Nettoyage du timer à la fin
    return () => clearInterval(intervals);
  }, []);

  if (minutes <= 0) {
    return (
      <p
        style={{
          background: "red",
          padding: "0px",
          margin: "0px",
          height: "50%",
          fontSize: "12px",
          color: "white",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        OUT SLA
      </p>
    );
  } else {
    const days = Math.floor(remainingTimeInSeconds / (24 * 3600));
    const hours = Math.floor((remainingTimeInSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
    const seconds = remainingTimeInSeconds % 60;
    return (
      <p
        style={{
          background: "green",
          padding: "0px",
          margin: "0px",
          height: "50%",
          fontSize: "12px",
          color: "white",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >{`
      ${days + "jr"} ${hours + "h"} ${minutes + "m"} ${seconds + "s"}
      `}</p>
    );
  }
}
export function dayDiff(d1, d2) {
  d1 = new Date(d1).getTime() / 86400000;
  d2 = new Date(d2).getTime() / 86400000;
  return new Number(d2 - d1).toFixed(0);
}
