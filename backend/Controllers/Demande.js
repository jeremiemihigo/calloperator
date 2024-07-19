const modelDemande = require("../Models/Demande");
const ModelPeriode = require("../Models/Periode");
const modelAgentAdmin = require("../Models/Agent");
const asyncLab = require("async");
const { generateNumber } = require("../Static/Static_Function");
const { ObjectId } = require("mongodb");
const modelRapport = require("../Models/Rapport");
const fs = require("fs");
const sharp = require("sharp");

module.exports = {
  demande: (req, res) => {
    try {
      const {
        codeclient,
        typeImage,
        codeAgent,
        codeZone,
        commune,
        numero,
        latitude, // si la photo est prise dans l'appli ce champs est obligatoire sinon il n'est pas obligatoire
        altitude, // si la photo est prise dans l'appli ce champs est obligatoire sinon il n'est pas obligatoire
        longitude, // si la photo est prise dans l'appli ce champs est obligatoire sinon il n'est pas obligatoire
        statut,
        raison,
        sector, //placeholder = Sector/constituency
        cell, //placeholder = Cell/Ward
        reference, //placeholder = Reference
        sat, //placeholder = SAT
      } = req.body;
      const { filename } = req.file;
      let annee = new Date().getFullYear().toString();

      const idDemande = `${annee.substr(
        2,
        3
      )}${new Date().getMonth()}${generateNumber(8)}`;
      if (
        !codeAgent ||
        !codeZone ||
        !statut ||
        !commune ||
        !sector ||
        !cell ||
        !reference ||
        !sat
      ) {
        return res.status(201).json("Veuillez renseigner les champs");
      }
      if (statut === "eteint" && raison === "undefined") {
        return res
          .status(201)
          .json("Veuillez renseigner la raison de non payement");
      }

      const io = req.io;
      asyncLab.waterfall(
        [
          function (done) {
            modelAgentAdmin
              .findOne({ codeAgent, active: true })
              .lean()
              .then((agentFound) => {
                if (agentFound) {
                  done(null, agentFound);
                } else {
                  return res.status(201).json("Agent introuvable");
                }
              })
              .catch(function (err) {
                return res.status(201).json("Erreur");
              });
          },

          function (agent, done) {
            modelDemande
              .findOne({ idDemande })
              .lean()
              .then((response) => {
                if (response) {
                  return res.status(201).json("Veuillez relancer la demande");
                } else {
                  done(null, agent);
                }
              })
              .catch(function (err) {
                return res.status(201).json("Erreur");
              });
          },
          function (agent, done) {
            ModelPeriode.findOne({})
              .lean()

              .then((response) => {
                if (response) {
                  done(null, agent, response);
                } else {
                  return res.status(201).json("Aucune période en cours");
                }
              })
              .catch(function (err) {
                return res.status(201).json("Erreur");
              });
          },

          function (agent, periode, done) {
            modelDemande
              .create({
                codeAgent: agent.codeAgent,
                codeZone,
                typeImage,
                coordonnes: { latitude, altitude, longitude },
                statut,
                raison: raison === "undefined" ? "" : raison,
                codeclient,
                lot: periode.periode,
                idDemande,
                sector,
                cell,
                reference,
                idShop: ["PO", "ZBM"].includes(agent.fonction)
                  ? ""
                  : agent.idShop,
                sat,
                file: filename,
                commune,
                numero,
              })
              .then((demande) => {
                if (demande) {
                  done(null, demande);
                } else {
                  return res
                    .status(201)
                    .json("Erreur d'enregistrement de la demande");
                }
              })
              .catch(function (err) {
                if (err.message) {
                  return res.status(201).json("" + err.message);
                } else {
                  return res.status(201).json("Erreur");
                }
              });
          },
          //compress image
          function (demande, done) {
            const path = `ImagesController/${demande.file}`;
            const pathdelete = `./ImagesController/${demande.file}`;

            sharp(path)
              .png({ quality: 30 })
              .toFile(`./Images/${demande.file}`)
              .then((result) => {
                fs.unlink(pathdelete, (err) => {
                  console.log(err);
                });
                done(demande);
              })
              .catch(function (err) {
                console.log(err);
              });
          },

          //delete Image
        ],
        function (demande) {
          req.recherche = demande.idDemande;
          next();
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(201).json("Erreur");
    }
  },
  DemandeAttente: (req, res) => {
    try {
      const { id, valide } = req.params;
      let value = valide === "1" ? true : false;

      modelDemande
        .aggregate([
          { $match: { codeAgent: id, valide: value } },
          {
            $lookup: {
              from: "agents",
              localField: "codeAgent",
              foreignField: "codeAgent",
              as: "agent",
            },
          },
          {
            $lookup: {
              from: "zones",
              localField: "codeZone",
              foreignField: "idZone",
              as: "zone",
            },
          },
          { $unwind: "$agent" },
          { $unwind: "$zone" },
        ])
        .then((response) => {
          return res.status(200).json(response);
        })
        .catch(function (err) {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  },
  ToutesDemande: (req, res) => {
    try {
      asyncLab.waterfall([
        function (done) {
          ModelPeriode.findOne({})
            .lean()
            .then((periode) => {
              if (periode) {
                done(null, periode);
              } else {
                return res.status(200).json([]);
              }
            })
            .catch(function (err) {
              console.log(err);
            });
        },
        function (periode, done) {
          modelRapport
            .find({ "demande.lot": periode.periode })
            .lean()
            .then((response) => {
              return res.status(200).json(response);
            })
            .catch(function (err) {
              console.log(err);
            });
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  },
  ToutesDemandeAgent: (req, res) => {
    try {
      const { id } = req.params;
      modelDemande
        .aggregate([
          { $match: { codeAgent: id } },
          {
            $lookup: {
              from: "reponses",
              localField: "idDemande",
              foreignField: "idDemande",
              as: "reponse",
            },
          },
          {
            $lookup: {
              from: "reclamation",
              localField: "idDemande",
              foreignField: "idDemande",
              as: "conversation",
            },
          },
        ])
        .then((response) => {
          return res.status(200).json(response);
        })
        .catch(function (err) {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  },
  lectureDemandeBd: (req, res) => {
    try {
      const { data, debut, fin } = req.body;
      let match = {
        $match: data,
      };
      const finDate = new Date(fin);

      finDate.setDate(finDate.getDate() + 1);

      modelDemande
        .aggregate([
          match,
          {
            $match: {
              createdAt: {
                $gte: new Date(debut),
                $lte: finDate,
              },
            },
          },
          {
            $lookup: {
              from: "rapports",
              localField: "idDemande",
              foreignField: "idDemande",
              as: "reponse",
            },
          },
          {
            $lookup: {
              from: "conversations",
              localField: "_id",
              foreignField: "code",
              as: "conversation",
            },
          },
          {
            $lookup: {
              from: "agents",
              localField: "codeAgent",
              foreignField: "codeAgent",
              as: "agent",
            },
          },
          {
            $lookup: {
              from: "zones",
              localField: "codeZone",
              foreignField: "idZone",
              as: "zone",
            },
          },
          {
            $unwind: "$agent",
          },
          {
            $unwind: "$zone",
          },
        ])
        .then((response) => {
          if (response) {
            return res.status(200).json(response.reverse());
          }
        });
    } catch (error) {
      console.log(error);
    }
  },
  lectureDemandeMobile: (req, res) => {
    try {
      const { lot, codeAgent } = req.params;
      let match = {
        $match: { lot, codeAgent },
      };
      modelDemande
        .aggregate([
          match,
          {
            $lookup: {
              from: "reponses",
              localField: "idDemande",
              foreignField: "idDemande",
              as: "reponse",
            },
          },
          {
            $lookup: {
              from: "conversations",
              localField: "_id",
              foreignField: "code",
              as: "conversation",
            },
          },
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
        ])
        .then((response) => {
          if (response) {
            return res.status(200).json(response.reverse());
          }
        });
    } catch (error) {
      console.log(error);
    }
  },
  ToutesDemandeAttente: (req, res) => {
    try {
      asyncLab.waterfall(
        [
          function (done) {
            ModelPeriode.findOne({})
              .lean()
              .then((periode) => {
                if (periode) {
                  done(null, periode);
                } else {
                  return res.status(200).json([]);
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          },
          function (periode, done) {
            modelDemande
              .aggregate([
                {
                  $match: {
                    valide: false,
                    lot: periode.periode,
                    feedback: "new",
                  },
                },
                {
                  $lookup: {
                    from: "agents",
                    localField: "codeAgent",
                    foreignField: "codeAgent",
                    as: "agent",
                  },
                },

                {
                  $lookup: {
                    from: "zones",
                    localField: "codeZone",
                    foreignField: "idZone",
                    as: "zone",
                  },
                },
                {
                  $lookup: {
                    from: "reponses",
                    localField: "idDemande",
                    foreignField: "idDemande",
                    as: "reponse",
                  },
                },
                { $unwind: "$agent" },
                { $unwind: "$zone" },
                {
                  $lookup: {
                    from: "shops",
                    localField: "agent.idShop",
                    foreignField: "idShop",
                    as: "shopAgent",
                  },
                },
                {
                  $lookup: {
                    from: "conversations",
                    localField: "_id",
                    foreignField: "code",
                    as: "conversation",
                  },
                },
              ])
              .then((response) => {
                if (response) {
                  done(response);
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          },
        ],
        function (result) {
          try {
            return res.status(200).json(result);
          } catch (error) {}
        }
      );
    } catch (error) {
      console.log(error);
    }
  },

  updateDemandeAgent: (req, res, next) => {
    try {
      const {
        codeclient,
        commune,
        numero,
        latitude, // si la photo est prise dans l'appli ce champs est obligatoire sinon il n'est pas obligatoire
        altitude, // si la photo est prise dans l'appli ce champs est obligatoire sinon il n'est pas obligatoire
        longitude, // si la photo est prise dans l'appli ce champs est obligatoire sinon il n'est pas obligatoire
        statut,
        raison,
        sector, //placeholder = Sector/constituency
        cell, //placeholder = Cell/Ward
        reference, //placeholder = Reference
        sat,
        id, //placeholder = SAT
      } = req.body;

      asyncLab.waterfall(
        [
          function (done) {
            modelDemande
              .findOne({ _id: new ObjectId(id), valide: false })
              .then((demande) => {
                console.log(demande);
                if (demande) {
                  done(null, demande);
                } else {
                  return res.status(201).json("Erreur");
                }
              })
              .catch(function (err) {
                console.log(err);
                return res.status(201).json("Erreur");
              });
          },
          function (demande, done) {
            modelDemande
              .findByIdAndUpdate(
                id,
                {
                  coordonnes: { latitude, altitude, longitude },
                  statut,
                  raison,
                  codeclient,
                  sector,
                  cell,
                  reference,
                  feedback: "new",
                  sat,
                  commune,
                  numero,
                },
                { new: true }
              )
              .then((response) => {
                done(response);
              })
              .catch(function (err) {
                console.log(err);
                return res.status(201).json("Erreur");
              });
          },
        ],
        function (result) {
          if (result) {
            req.recherche = result.idDemande;
            next();
          } else {
            return res.status(201).json("Erreur");
          }
        }
      );

      // const { filename } = req.file
    } catch (error) {
      console.log(error);
    }
  },
  updateDemandeAgentFile: (req, res, next) => {
    try {
      const {
        codeclient,
        commune,
        numero,
        latitude, // si la photo est prise dans l'appli ce champs est obligatoire sinon il n'est pas obligatoire
        altitude, // si la photo est prise dans l'appli ce champs est obligatoire sinon il n'est pas obligatoire
        longitude, // si la photo est prise dans l'appli ce champs est obligatoire sinon il n'est pas obligatoire
        statut,
        raison,
        sector, //placeholder = Sector/constituency
        cell, //placeholder = Cell/Ward
        reference, //placeholder = Reference
        sat,
        id, //placeholder = SAT
      } = req.body;
      const { filename } = req.file;
      asyncLab.waterfall(
        [
          function (done) {
            modelDemande
              .findOne({ _id: new ObjectId(id), valide: false })
              .then((demande) => {
                if (demande) {
                  done(null, demande);
                } else {
                  return res.status(201).json("Erreur");
                }
              })
              .catch(function (err) {
                return res.status(201).json("Erreur");
              });
          },
          function (demande, done) {
            try {
              modelDemande
                .findByIdAndUpdate(
                  id,
                  {
                    coordonnes: { latitude, altitude, longitude },
                    statut,
                    raison,
                    codeclient,
                    sector,
                    cell,
                    reference,
                    sat,
                    file: filename,
                    commune,
                    feedback: "new",
                    numero,
                  },
                  { new: true }
                )
                .then((response) => {
                  done(null, response);
                })
                .catch(function (err) {
                  console.log(err);
                  return res.status(201).json("Erreur");
                });
            } catch (error) {
              console.log(error);
            }
          },
          function (demande, done) {
            const path = `ImagesController/${demande.file}`;
            const pathdelete = `./ImagesController/${demande.file}`;

            sharp(path)
              .png({ quality: 30 })
              .toFile(`./Images/${demande.file}`)
              .then((result) => {
                fs.unlink(pathdelete, (err) => {
                  console.log(err);
                });
                done(demande);
              })
              .catch(function (err) {
                console.log(err);
              });
          },
        ],
        function (result) {
          req.recherche = result.idDemande;
          next();
        }
      );

      // const { filename } = req.file
    } catch (error) {
      console.log(error);
    }
  },

  R_Insert_Updated: (req, res) => {
    try {
      const idDemande = req.recherche;
      const io = req.io;
      modelDemande
        .aggregate([
          {
            $match: {
              idDemande,
            },
          },
          {
            $lookup: {
              from: "agents",
              localField: "codeAgent",
              foreignField: "codeAgent",
              as: "agent",
            },
          },

          {
            $lookup: {
              from: "zones",
              localField: "codeZone",
              foreignField: "idZone",
              as: "zone",
            },
          },
          {
            $lookup: {
              from: "reponses",
              localField: "idDemande",
              foreignField: "idDemande",
              as: "reponse",
            },
          },
          { $unwind: "$agent" },
          { $unwind: "$zone" },
          {
            $lookup: {
              from: "shops",
              localField: "agent.idShop",
              foreignField: "idShop",
              as: "shopAgent",
            },
          },
          {
            $lookup: {
              from: "conversations",
              localField: "_id",
              foreignField: "code",
              as: "conversation",
            },
          },
        ])
        .then((response) => {
          if (response) {
            io.emit("demande", response);
            return res.status(200).json(response);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    } catch (error) {}
  },
};
