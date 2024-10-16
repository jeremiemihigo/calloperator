const asyncLab = require("async");
const ModelDemande = require("../Models/Demande");
const _ = require("lodash");
const dayjs = require("dayjs");
const Reclamation = require("../Models/Reclamation");
const modelRapport = require("../Models/Rapport");
const modelAppel = require("../Models/Issue/Appel_Issue");
const moment = require("moment");

module.exports = {
  reponse: (req, res, next) => {
    try {
      const {
        idDemande,
        codeClient,
        adresschange,
        codeCu,
        clientStatut,
        PayementStatut,
        nomDemandeur,
        consExpDays,
        nomClient,
        idZone,
        codeAgent,
        createdAt,
        demande,
        coordonnee,
        idShop,
        fonctionAgent,
        codeAgentDemandeur,
        _idDemande,
        nomAgentSave,
      } = req.body;
      if (
        !idDemande ||
        !codeAgent ||
        !codeClient ||
        !clientStatut ||
        adresschange === "" ||
        !PayementStatut ||
        !consExpDays ||
        !nomClient ||
        !idZone ||
        !demande ||
        !nomDemandeur ||
        !createdAt
      ) {
        return res.status(400).json("Veuillez renseigner les champs");
      }
      const dates = new Date().toISOString();
      const io = req.io;
      const periode = moment(new Date()).format("MM-YYYY");

      asyncLab.waterfall(
        [
          function (done) {
            modelRapport
              .findOne(
                {
                  "demande.lot": periode.toString(),
                  codeclient: codeClient.trim(),
                  "demandeur.fonction": fonctionAgent,
                },
                {
                  demandeur: 1,
                  codeclient: 1,
                  idDemande: 1,
                  "demande.createdAt": 1,
                  createdAt: 1,
                }
              )
              .lean()
              .then((doublon) => {
                if (doublon) {
                  let doubleAgent =
                    doublon.demandeur.codeAgent === codeAgentDemandeur;

                  if (doubleAgent) {
                    if (
                      new Date(doublon.demande.createdAt).getDate() ===
                      new Date(createdAt).getDate()
                    ) {
                      done(null, "oneDay", doublon);
                    } else {
                      done(null, "followup", doublon);
                    }
                  } else {
                    let double = {
                      codeclient: doublon.codeclient,
                      precedent: doublon.idDemande,
                      present: idDemande,
                      agentCo: codeAgent,
                      message: `visite effectuée le ${dayjs(
                        doublon.demande.createdAt
                      ).format("DD/MM/YYYY")} par ${
                        doublon.demandeur.nom
                      } code : ${doublon.demandeur.codeAgent}`,
                      _idDemande,
                    };
                    io.emit("chat", { idDemande });
                    req.recherche = double;
                    next();
                  }
                } else {
                  done(null, "demande", doublon);
                }
              });
          },
          function (type, doublon, done) {
            if (type === "oneDay") {
              let double = {
                idDemande,
                agentCo: codeAgent,
                doublon: doublon.codeclient,
              };
              io.emit("chat", { idDemande });
              req.recherche = double;
              next();
            }
            if (type === "followup") {
              ModelDemande.findOneAndUpdate(
                { idDemande },
                {
                  $set: {
                    typeVisit: {
                      followup: "followup",
                      dateFollowup: doublon?.createdAt,
                      codeclient: doublon?.codeclient,
                    },
                    feedback: "chat",
                  },
                }
              )
                .then((result) => {
                  io.emit("chat", { idDemande });
                  return res.status(200).json(idDemande);
                })
                .catch(function (err) {
                  console.log(err);
                });
            }
            if (type === "demande") {
              done(null, true);
            }
          },

          function (demandes, done) {
            modelRapport
              .create({
                idDemande,
                codeclient: codeClient,
                idShop,
                idZone,
                codeCu,
                clientStatut,
                PayementStatut,
                consExpDays,
                nomClient,
                codeAgent: codeAgent,
                dateSave: dates.split("T")[0],
                adresschange,
                agentSave: { nom: nomAgentSave },
                demandeur: {
                  nom: nomDemandeur,
                  codeAgent: codeAgentDemandeur,
                  fonction: fonctionAgent,
                },
                coordonnee,
                demande,
              })
              .then((response) => {
                if (response) {
                  done(null, response);
                } else {
                  done("Erreur d'enregistrement");
                }
              })
              .catch(function (err) {
                console.log(err);
                done("Erreur " + err);
              });
          },
          function (response, done) {
            try {
              Reclamation.deleteMany({ code: _idDemande })
                .then((deleted) => {
                  done(response);
                })
                .catch(function (err) {});
            } catch (error) {}
          },
        ],
        function (response) {
          if (response.codeclient) {
            io.emit("reponse", response);
            return res.status(200).json(idDemande);
          } else {
            return res.status(400).json("Error");
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
  OneReponse: (req, res) => {
    try {
      const { id } = req.params;
      asyncLab.waterfall(
        [
          function (done) {
            modelRapport
              .find({ codeclient: id })
              .lean()
              .then((response) => {
                if (response.length > 0) {
                  done(null, response.reverse());
                } else {
                  done(null, []);
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          },
          function (reponse, done) {
            modelAppel
              .aggregate([
                { $match: { codeclient: id } },
                {
                  $lookup: {
                    from: "messages",
                    localField: "idPlainte",
                    foreignField: "idPlainte",
                    as: "message",
                  },
                },
              ])
              .then((result) => {
                done(reponse, result);
              })
              .catch(function (err) {
                console.log(err);
              });
          },
        ],
        function (visites, appels) {
          return res.status(200).json({ visites, appels });
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
  updateReponse: (req, res) => {
    try {
      const { idReponse, data } = req.body;
      modelRapport
        .findByIdAndUpdate(idReponse, data, { new: true })
        .then((response) => {
          return res.status(200).json(response);
        })
        .catch(function (err) {
          return res.status(201).json(err);
        });
    } catch (error) {}
  },
  //A demolir
  ReponseDemandeLot: (req, res) => {
    try {
      const periode = moment(new Date()).format("MM-YYYY");
      asyncLab.waterfall(
        [
          function (done) {
            ModelDemande.aggregate([
              { $match: { lot: periode } },
              {
                $lookup: {
                  from: "reponses",
                  localField: "idDemande",
                  foreignField: "idDemande",
                  as: "reponse",
                },
              },
            ])
              .then((reponse) => {
                if (reponse.length > 0) {
                  done(reponse);
                } else {
                  done([]);
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          },
        ],
        function (result) {
          try {
            if (result) {
              let donner = result.filter((x) => x.reponse.length > 0);
              return res.status(200).json(donner);
            } else {
              return res.status(201).json([]);
            }
          } catch (error) {
            console.log(error);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
  SupprimerReponse: (req, res) => {
    try {
      const { id, message } = req.body;
      const periode = moment(new Date()).format("MM-YYYY");
      asyncLab.waterfall(
        [
          function (done) {
            ModelDemande.findOneAndUpdate(
              { idDemande: id, lot: periode },
              { $set: { valide: false, feedback: "chat" } },
              { new: true }
            )
              .then((demande) => {
                if (demande) {
                  done(null, demande);
                } else {
                  return res
                    .status(201)
                    .json("Cette demande n'est pas de ce mois en cours");
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          },
          function (demande, done) {
            Reclamation.create({
              sender: "co",
              code: demande._id,
              message,
              codeAgent: req.user.codeAgent,
            })
              .then((message) => {
                if (message) {
                  done(null, demande);
                } else {
                  return res.status(201).json("Error");
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          },
          function (demande, done) {
            modelRapport
              .findOneAndDelete({ idDemande: demande.idDemande })
              .then((result) => {
                done(result);
              })
              .catch(function (err) {
                console.log(err);
              });
          },
        ],
        function (result) {
          if (result) {
            return res.status(200).json(result);
          } else {
            return res.status(201).json("Reponse introuvable");
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
};
