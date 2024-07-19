const asyncLab = require("async");
const ModelDemande = require("../Models/Demande");
const _ = require("lodash");
const ModelPeriode = require("../Models/Periode");
const dayjs = require("dayjs");
const Reclamation = require("../Models/Reclamation");
const modelRapport = require("../Models/Rapport");

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
        consExpDays,
        nomClient,
        idZone,
        codeAgent,
        idShop,
        fonctionAgent,
        codeAgentDemandeur,
        _idDemande,
        nomAgentSave,
      } = req.body;

      // const {} = req.user
      if (
        !idDemande ||
        !codeAgent ||
        !codeClient ||
        !clientStatut ||
        adresschange === "" ||
        !PayementStatut ||
        !consExpDays ||
        !nomClient ||
        !idZone
      ) {
        return res.status(400).json("Veuillez renseigner les champs");
      }
      const dates = new Date().toISOString();
      const io = req.io;

      asyncLab.waterfall(
        [
          function (done) {
            //agent = co
            ModelPeriode.findOne({})
              .limit(1)
              .then((response) => {
                if (response) {
                  done(null, response);
                } else {
                  done("Aucune période en cours");
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          },
          function (periode, done) {
            modelRapport
              .find({
                "demande.lot": periode.periode,
                codeclient: codeClient.trim(),
              })
              .lean()
              .then((result) => {
                if (result.length > 0) {
                  const doublon = result.filter(
                    (x) => x.demandeur.fonction === fonctionAgent
                  );
                  if (doublon.length > 0) {
                    if (doublon[0].demandeur.codeAgent === codeAgentDemandeur) {
                      let double = {
                        idDemande: idDemande,
                        doublon: doublon[0].idDemande,
                        agentCo: codeAgent,
                      };
                      req.recherche = double;
                      next();
                    } else {
                      let double = {
                        codeclient: doublon[0].codeclient,
                        precedent: doublon[0].idDemande,
                        present: idDemande,
                        agentCo: codeAgent,
                        message: `visite effectuée le ${dayjs(
                          doublon[0]?.demande.createdAt
                        ).format("DD/MM/YYYY")} par ${
                          doublon[0].demandeur.nom
                        } code : ${doublon[0].demandeur.codeAgent}`,
                        _idDemande,
                      };
                      req.recherche = double;
                      next();
                    }
                  } else {
                    done(null, periode);
                  }
                } else {
                  done(null, periode);
                }
              });
          },
          function (periode, done) {
            ModelDemande.aggregate([
              { $match: { idDemande } },
              {
                $lookup: {
                  from: "agents",
                  localField: "codeAgent",
                  foreignField: "codeAgent",
                  as: "agent",
                },
              },
              {
                $unwind: "$agent",
              },
            ]).then((result) => {
              if (result.length > 0) {
                done(null, result[0]);
              }
            });
          },

          function (demande, done) {
            modelRapport
              .create({
                idDemande: demande.idDemande,
                codeclient: codeClient,
                idShop,
                idZone,
                codeCu,
                clientStatut,
                PayementStatut,
                consExpDays,
                nomClient, // La periode
                codeAgent: codeAgent,
                dateSave: dates.split("T")[0],
                adresschange,
                agentSave: { nom: nomAgentSave },
                demandeur: {
                  nom: demande.agent.nom,
                  codeAgent: demande.agent.codeAgent,
                  fonction: demande.agent.fonction,
                },
                coordonnee: {
                  longitude: demande.coordonnes.longitude,
                  latitude: demande.coordonnes.latitude,
                  altitude: demande.coordonnes.altitude,
                },

                demande: {
                  typeImage: demande.typeImage,
                  createdAt: demande.createdAt,
                  numero: demande.numero,
                  commune: demande.commune,
                  updatedAt: demande.updatedAt,
                  createdAt: demande.createdAt,
                  statut: demande.statut,
                  sector: demande.sector,
                  lot: demande.lot,
                  cell: demande.cell,
                  file: demande.file,
                  reference: demande.reference,
                  sat: demande.sat,
                  raison: demande.raison,
                },
              })
              .then((response) => {
                if (response) {
                  done(null, demande);
                } else {
                  done("Erreur d'enregistrement");
                }
              })
              .catch(function (err) {
                console.log(err);
                done("Erreur 2");
              });
          },
          function (demande, done) {
            try {
              Reclamation.deleteMany({ code: demande._id })
                .then((deleted) => {
                  done(demande);
                })
                .catch(function (err) {});
            } catch (error) {}
          },
        ],
        function (result) {
          if (result.idDemande) {
            io.emit("reponse", result);
            return res.status(200).json(result.idDemande);
          } else {
            return res.status(400).json(result);
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
      modelRapport
        .find({ codeclient: id })
        .lean()
        .then((response) => {
          if (response.length > 0) {
            return res.status(200).json(response);
          } else {
            return res.status(200).json([]);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
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
          return res
            .status(200)
            .json("Modification effectuée id " + response._id);
        });
    } catch (error) {}
  },
  //A demolir
  ReponseDemandeLot: (req, res) => {
    try {
      asyncLab.waterfall(
        [
          function (done) {
            ModelPeriode.findOne({})
              .then((response) => {
                if (response) {
                  done(null, response);
                } else {
                  done([]);
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          },
          function (periode, done) {
            ModelDemande.aggregate([
              { $match: { lot: periode.periode } },
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
};
