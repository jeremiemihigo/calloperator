const modelAppel = require("../../Models/Issue/Appel");
const asyncLab = require("async");
const ModelDelai = require("../../Models/Periode");
const { sla } = require("../../Static/Static_Function");
const modelPeriode = require("../../Models/Periode");
const modelRapport = require("../../Models/Rapport");
const _ = require("lodash");

module.exports = {
  Appel: (req, res) => {
    const io = req.io;
    try {
      const {
        codeclient,
        idPlainte,
        typePlainte,
        plainteSelect,
        recommandation,
        nomClient,
      } = req.body;
      if (
        !codeclient ||
        !typePlainte ||
        !plainteSelect ||
        !recommandation ||
        !nomClient ||
        !idPlainte
      ) {
        return res.status(201).json("Veuillez renseigner les champs vides");
      }
      asyncLab.waterfall(
        [
          function (done) {
            modelAppel
              .findOne({ idPlainte })
              .lean()
              .then((plainte) => {
                if (plainte) {
                  done(null, plainte);
                } else {
                  return res.status(201).json("Error");
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          },
          function (plainte, done) {
            modelPeriode
              .findOne({})
              .lean()
              .then((params) => {
                if (params) {
                  done(null, plainte, params);
                } else {
                  return res.status(404).json("Le delai n'est pas renseigne");
                }
              })
              .catch(function (err) {
                return res.status(404).json("Error " + err);
              });
          },
          function (plainte, delai, done) {
            let d =
              delai.delai <= sla(plainte.fullDateSave) ? "IN SLA" : "OUT SLA";
            modelAppel
              .findOneAndUpdate(
                {
                  idPlainte,
                },
                {
                  $set: {
                    typePlainte,
                    plainteSelect,
                    recommandation,
                    nomClient,
                    dateClose: new Date(),
                    statut: "resolved",
                    delai: d,
                  },
                },
                { new: true }
              )
              .then((result) => {
                done(result);
              });
          },
        ],
        function (result) {
          if (result) {
            io.emit("appel", result);
            return res.status(200).json(result);
          } else {
            return res.status(404).json("Error");
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
  OpenCall: (req, res) => {
    try {
      const { nom } = req.user;
      const { codeclient } = req.body;
      const date = new Date().toISOString();
      const periode = `${
        new Date().getMonth() < 10
          ? `0${new Date().getMonth()}`
          : `${new Date().getMonth()}`
      }-${new Date().getFullYear()}`;
      if (!codeclient) {
        return res.status(201).json("Error");
      }
      asyncLab.waterfall([
        function (done) {
          modelAppel
            .create({
              openBy: nom,
              codeclient,
              dateSave: date.split("T")[0],
              fullDateSave: date,
              statut: "open",
              idPlainte: new Date().getTime(),
            })
            .then((result) => {
              if (result) {
                done(null, result);
              } else {
                return res.status(201).json("Error");
              }
            })
            .catch(function (err) {
              console.log(err);
            });
        },
        function (result, done) {
          modelRapport
            .find({
              codeclient,
              "demande.lot": periode,
            })
            .then((visite) => {
              if (visite.length > 0) {
                let p_identique = _.filter(visite, {
                  adresschange: "N'est pas identique",
                });
                if (p_identique.length > 0) {
                  let v = p_identique[p_identique.length - 1];
                  done(null, result, v);
                }
              } else {
                done(null, visite);
              }
            })
            .catch(function (err) {
              console.log(err);
            });
        },
        function (result, visite) {
          return res.status(200).json({ result, visite });
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  },
  setDelai: (req, res) => {
    try {
      const { delai } = req.body;
      if (!delai || delai === 0) {
        return res.status(201).json("Error");
      }
      ModelDelai.findOneAndUpdate(
        {},
        {
          $set: {
            delai,
          },
        },
        { new: true }
      )
        .then((result) => {
          if (result) {
            return res.status(200).json(result);
          } else {
            return res.status(400).json("Error");
          }
        })
        .catch(function (err) {
          return res.status(400).json("Error " + err);
        });
    } catch (error) {
      console.log(error);
    }
  },
  AppelToday: (req, res) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      modelAppel
        .find(
          {
            dateSave: new Date(today),
            statut: "resolved",
          },
          {
            openBy: 1,
            codeclient: 1,
            dateSave: 1,
            fullDateSave: 1,
            statut: 1,
            idPlainte: 1,
            dateClose: 1,
            delai: 1,
            plainteSelect: 1,
            recommandation: 1,
            typePlainte: 1,
            nomClient: 1,
          }
        )
        .lean()
        .then((result) => {
          console.log(result);
          return res.status(200).json(result.reverse());
        });
    } catch (error) {
      console.log(error);
    }
  },
};
