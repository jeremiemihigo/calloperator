const ModelClient = require("../../Models/DefaultTracker/TableClient");
const ModelFeedback = require("../../Models/Feedback");
const asyncLab = require("async");
const moment = require("moment");
const { ObjectId } = require("mongodb");

const Arbitrage = async (req, res) => {
  try {
    const { data } = req.body;
    console.log(data);
    //id, current_status, changeto, feedback
    asyncLab.waterfall([
      function (done) {
        async function updateClientsWithBulk() {
          const bulkoperation = data.map((client) => {
            return {
              updateOne: {
                filter: { _id: new ObjectId(client.id) },
                update: {
                  $set: client.data,
                },
              },
            };
          });
          try {
            const result = await ModelClient.bulkWrite(bulkoperation);
            if (result) {
              return res.status(200).json("Operation completed successfully");
            }
          } catch (error) {
            return res.status(201).json(error.message);
          }
        }
        updateClientsWithBulk();
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};
const ReadArbitrage = async (req, res) => {
  try {
    const month = moment(new Date()).format("MM-YYYY");
    asyncLab.waterfall(
      [
        function (done) {
          ModelFeedback.find({})
            .lean()
            .then((result) => {
              done(null, result);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        function (feedbacks, done) {
          ModelClient.aggregate([
            {
              $match: {
                month,
                actif: true,
                $or: [
                  {
                    feedback: { $in: ["PENDING", "REJECTED"] },
                  },
                  { currentFeedback: { $in: ["Categorisation", "autre"] } },
                ],
              },
            },

            {
              $lookup: {
                from: "tfeedbacks",
                localField: "currentFeedback",
                foreignField: "idFeedback",
                as: "currentfeedback",
              },
            },
            {
              $lookup: {
                from: "tfeedbacks",
                localField: "changeto",
                foreignField: "idFeedback",
                as: "fchangeto",
              },
            },
            { $unwind: "$currentfeedback" },

            {
              $lookup: {
                from: "roles",
                localField: "currentfeedback.idRole",
                foreignField: "idRole",
                as: "fcurrent_incharge",
              },
            },
            {
              $lookup: {
                from: "rapports",
                localField: "codeclient",
                foreignField: "codeclient",
                as: "visites",
              },
            },
            {
              $lookup: {
                from: "pfeedback_calls",
                let: { codeclient: "$codeclient" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$codeclient", "$$codeclient"] },
                          { $eq: ["$type", "Reachable"] },
                        ],
                      },
                    },
                  },
                ],
                as: "appelles",
              },
            },
            {
              $addFields: {
                last_call: {
                  $arrayElemAt: [
                    {
                      $reverseArray: "$appelles", // Renverse l'ordre du tableau
                    },
                    0,
                  ],
                },
              },
            },
            {
              $project: {
                last_call: 1,
                visites: 1,
                customer_name: "$nomclient",
                shop: 1,
                par: 1,
                submitedBy: 1,
                region: 1,
                //use
                id: "$_id",
                customer_id: "$codeclient",
                idFeedback: "$currentfeedback.idFeedback",
                currentFeedback: "$currentfeedback.title",
                nextFeedback: "$fchangeto.title",
              },
            },
          ])
            .then((result) => {
              done(null, result, feedbacks);
            })
            .catch((err) => done(err));
        },
      ],
      function (err, result, feedbacks) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Erreur lors de l'exécution de la requête." });
        }
        return res.status(200).json({ result, feedbacks });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur inattendue." });
  }
};
const PostArbitrage_Automatique = async (req, res, next) => {
  try {
    const month = moment().format("MM-YYYY");
    asyncLab.waterfall(
      [
        function (done) {
          ModelFeedback.find({})
            .lean()
            .then((result) => done(null, result))
            .catch((error) => {
              done(error);
            });
        },
        function (feedbacks, done) {
          ModelClient.aggregate([
            {
              $match: {
                month,
                actif: true,
                currentFeedback: "Categorisation",
                feedback: "APPROVED",
              },
            },
            {
              $lookup: {
                from: "rapports",
                localField: "codeclient",
                foreignField: "codeclient",
                as: "visites",
              },
            },

            {
              $project: {
                codeclient: 1,
                visites: 1,
                currentFeedback: 1,
                submitedBy: 1,
              },
            },
          ])
            .then((result) => done(null, feedbacks, result))
            .catch((err) => {
              console.log("Erreur lors de l'aggregation:", err);
              done(err);
            });
        },
        function (feedbacks, result, done) {
          const idProcessOfficer = "1750079717209";
          const returnVerification = (id) => {
            let feed = feedbacks.filter(
              (x) =>
                x.idFeedback === id ||
                x.title.toUpperCase() === id.toUpperCase()
            );
            if (
              feed.length > 0 &&
              (feed[0]?.verification || feed[0].idRole === idProcessOfficer)
            ) {
              return true;
            } else {
              return false;
            }
          };
          const returnType = (visites) => {
            if (!visites || visites.length === 0) return null;
            if (visites.some((x) => x.demandeur.fonction === "PO")) return "po";
            if (
              visites.some((x) =>
                ["RS", "SM", "TL"].includes(x.demandeur.fonction)
              )
            )
              return "staff";
            if (
              visites.some((x) =>
                ["agent", "tech", "stagiaire", "AR"].includes(
                  x.demandeur.fonction
                )
              )
            )
              return "agents";
            return null;
          };
          const returnFeedback = (client) => {
            const type = returnType(client.visites);
            if (!type) return { feedback: "Categorisation", name: "System" };
            const filtrer = (fcts) =>
              client.visites.filter((x) => fcts.includes(x.demandeur.fonction));
            const lastVisite = filtrer(
              type === "po"
                ? ["PO"]
                : type === "staff"
                ? ["RS", "SM", "TL"]
                : ["agent", "tech", "stagiaire", "AR"]
            ).at(-1);

            if (!lastVisite)
              return { feedback: "Categorisation", visite: "", name: "System" };

            const matched = feedbacks.find(
              (x) => x.idFeedback === lastVisite.demande.raison
            );

            if (
              type === "agents" &&
              returnVerification(lastVisite.demande.raison)
            ) {
              return {
                feedback: "Awaiting_verification",
                name: "System",
                visite: lastVisite.idDemande,
              };
            }
            if (
              type === "agents" &&
              !returnVerification(lastVisite.demande.raison)
            ) {
              return matched
                ? {
                    feedback: matched.idFeedback,
                    name: lastVisite.demandeur.nom,
                    visite: lastVisite.idDemande,
                  }
                : { feedback: "Categorisation", visite: "", name: "System" };
            }

            return matched
              ? {
                  feedback: matched.idFeedback,
                  visite: lastVisite.idDemande,
                  name: lastVisite.demandeur.nom,
                }
              : { feedback: "Categorisation", visite: "", name: "System" };
          };
          if (result.length === 0) return done();

          async function updateClientsWithBulk() {
            const bulkoperation = result.map((client) => {
              const retour = returnFeedback(client);
              return {
                updateOne: {
                  filter: { codeclient: client.codeclient, month, actif: true },
                  update: {
                    $set: {
                      feedback: "APPROVED",
                      currentFeedback: retour.feedback,
                      submitedBy: retour.name,
                      visite: retour.visite,
                    },
                  },
                },
              };
            });

            try {
              await ModelClient.bulkWrite(bulkoperation);
              done();
            } catch (error) {
              console.log("Erreur bulkWrite:", error);
              done(error);
            }
          }

          updateClientsWithBulk();
        },
      ],
      function (err) {
        if (err) {
          console.log("Erreur finale:", err);
          return next(err);
        }
        next();
      }
    );
  } catch (error) {
    console.log("Erreur principale:", error);
    next(error);
  }
};
const PostArbitrage_ = async (req, res, next) => {
  try {
    const month = moment().format("MM-YYYY");

    asyncLab.waterfall(
      [
        function (done) {
          ModelFeedback.find({})
            .lean()
            .then((result) => done(null, result))
            .catch((error) => {
              done(error);
            });
        },
        function (feedbacks, done) {
          ModelClient.aggregate([
            {
              $match: {
                month,
                actif: true,
                feedback: "APPROVED",
                currentFeedback: "Categorisation",
              },
            },
            {
              $lookup: {
                from: "rapports",
                localField: "codeclient",
                foreignField: "codeclient",
                as: "visites",
              },
            },
            {
              $project: {
                codeclient: 1,
                visites: 1,
                currentFeedback: 1,
              },
            },
          ])
            .then((result) => done(null, feedbacks, result))
            .catch((err) => {
              done(err);
            });
        },
        function (feedbacks, result, done) {
          const returnType = (visites) => {
            if (!visites || visites.length === 0) return null;
            if (visites.some((x) => x.demandeur.fonction === "PO")) return "po";
            if (
              visites.some((x) =>
                ["RS", "SM", "TL"].includes(x.demandeur.fonction)
              )
            )
              return "staff";
            if (
              visites.some((x) =>
                ["agent", "tech", "stagiaire", "AR"].includes(
                  x.demandeur.fonction
                )
              )
            )
              return "agents";
            return null;
          };
          const returnFeedback = (client) => {
            const type = returnType(client.visites);
            if (!type)
              return {
                feedback: client.currentFeedback,
                name: client.submitedBy,
                visite: client?.visite,
              };
            const filtrer = (fcts) =>
              client.visites.filter((x) => fcts.includes(x.demandeur.fonction));
            const lastVisite = filtrer(
              type === "po"
                ? ["PO"]
                : type === "staff"
                ? ["RS", "SM", "TL"]
                : ["agent", "tech", "stagiaire", "AR"]
            ).at(-1);

            if (!lastVisite)
              return {
                feedback: client.currentFeedback,
                name: client.submitedBy,
                visite: client?.visite,
              };

            const matched = feedbacks.find(
              (x) => x.idFeedback === lastVisite.demande.raison
            );

            return matched
              ? {
                  feedback: matched.idFeedback,
                  visite: lastVisite.idDemande,
                  name: lastVisite.demandeur.nom,
                }
              : {
                  feedback: client.currentFeedback,
                  name: client.submitedBy,
                  visite: client?.visite,
                };
          };

          if (result.length === 0) return done();

          async function updateClientsWithBulk() {
            const bulkoperation = result.map((client) => {
              const retour = returnFeedback(client);
              return {
                updateOne: {
                  filter: { codeclient: client.codeclient, month, actif: true },
                  update: {
                    $set: {
                      feedback: "APPROVED",
                      currentFeedback: retour.feedback,
                      submitedBy: retour.name,
                      visite: retour.visite,
                    },
                  },
                },
              };
            });

            try {
              await ModelClient.bulkWrite(bulkoperation);
              done();
            } catch (error) {
              console.log("Erreur bulkWrite:", error);
              done(error);
            }
          }
          updateClientsWithBulk();
        },
      ],
      function (err) {
        if (err) {
          console.log("Erreur finale:", err);
          return next(err);
        }
        next();
      }
    );
  } catch (error) {
    console.log("Erreur principale:", error);
    next(error);
  }
};

module.exports = {
  Arbitrage,
  PostArbitrage_Automatique,
  ReadArbitrage,
  PostArbitrage_,
};
