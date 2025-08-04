const ModelClient = require("../../Models/DefaultTracker/TableClient");
const asyncLab = require("async");
const moment = require("moment");
const ModelRapport = require("../../Models/Rapport");

const categorisationAutomatique = (req, res) => {
  try {
    const recherche = req.recherche;
    const month = moment().format("MM-YYYY");
    let code =
      req.user.idvm.length > 0 ? req.user.idvm[0].codeAgent : undefined;
    asyncLab.waterfall([
      function (done) {
        if (code !== undefined) {
          ModelClient.aggregate([
            { $match: recherche },
            {
              $lookup: {
                from: "rapports",
                let: { codeclient: "$codeclient" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$demande.lot", month] },
                          { $eq: ["$used", false] },
                          { $eq: ["$codeclient", "$$codeclient"] },
                          { $eq: ["$demandeur.codeAgent", code] },
                        ],
                      },
                    },
                  },
                ],
                as: "visites",
              },
            },
            { $match: { visites: { $not: { $size: 0 } } } },
            { $unwind: "$visites" },
            {
              $lookup: {
                from: "tfeedbacks",
                localField: "visites.demande.raison",
                foreignField: "idFeedback",
                as: "feedback",
              },
            },
            { $match: { feedback: { $not: { $size: 0 } } } },
            {
              $project: {
                _id: 0,
                codeclient: "$codeclient",
                currentFeedback: "$visites.demande.raison",
                idDemande: "$visites.idDemande",
                lastfeedback: "$currentFeedback",
              },
            },
          ]).then((result) => {
            done(null, result);
          });
        } else {
          if (req.user.fonction === "admin") {
            let taille = req.user.nom.split(" ").length;
            let nom =
              taille > 1 ? req.user.nom.split(" ")[taille - 1] : req.user.nom;
            return res
              .status(201)
              .json(
                `Please ${nom} Your account is not linked to a household visit account in this case you will change the feedback manually`
              );
          }
        }
      },
      function (clients, done) {
        if (clients.length > 0) {
          const fonctionSla = (dateupdate) => {
            const now = new Date();
            const diffMs = now - dateupdate;
            const diffHours = diffMs / (1000 * 60 * 60); // conversion en heures
            const sla = diffHours > 72 ? "OUT SLA" : "IN SLA";
            return sla;
          };
          async function updateClientsWithBulk() {
            const bulkoperation = clients.map((client) => ({
              updateOne: {
                filter: {
                  codeclient: client.codeclient,
                  month,
                  actif: true,
                  // feedback: "PENDING",
                },
                update: {
                  $set: {
                    currentFeedback: client.currentFeedback,
                    submitedBy: req.user.nom,
                    dateupdate: new Date(),
                  },
                  $push: {
                    historique: {
                      lastfeedback: client.lastFeedback,
                      nextfeedback: client.currentFeedback,
                      submitedBy: req.user.nom,
                      poste: req.user.poste,
                      departement: req.user.role,
                      sla: fonctionSla(client.dateupdate),
                    },
                  },
                },
                returnDocument: "after",
              },
            }));
            try {
              const result = await ModelClient.bulkWrite(bulkoperation);

              if (result) {
                done(null, clients);
              }
            } catch (error) {
              console.log(error);
            }
          }
          updateClientsWithBulk();
        } else {
          return res.status(200).json("Aucune visite trouvée");
        }
      },
      function (clients, done) {
        let idDemande = clients.map((x) => {
          return x.idDemande;
        });
        ModelRapport.updateMany(
          { idDemande: { $in: idDemande } },
          { $set: { used: true } }
        ).then((result) => {
          if (result) {
            return res.status(200).json("Done");
          }
        });
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};
module.exports = { categorisationAutomatique };
