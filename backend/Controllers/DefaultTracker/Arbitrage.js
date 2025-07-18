const ModelClient = require("../../Models/DefaultTracker/TableClient");
const ModelFeedback = require("../../Models/Feedback");
const asyncLab = require("async");
const moment = require("moment");
const lodash = require("lodash");

const Arbitrage = async (req, res) => {
  try {
    const { id, current_status, changeto, submitedBy, commentaire, feedback } =
      req.body;
    const { nom } = req.user;

    asyncLab.waterfall(
      [
        function (done) {
          let currentF = feedback === "Approved" ? changeto : current_status;
          ModelClient.findByIdAndUpdate(
            id,
            {
              $set: {
                feedback,
                currentFeedback: currentF,
              },
              $push: {
                Hist_Arbitrage: {
                  current_status,
                  changeto,
                  submitedBy,
                  checkedBy: nom,
                  commentaire,
                  feedback,
                },
              },
            },
            { new: true }
          )
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
          return res.status(201).json("Error");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const ReadArbitrage = async (req, res) => {
  try {
    const month = moment(new Date()).format("MM-YYYY");
    asyncLab.waterfall(
      [
        // 1. Récupération du rôle
        // function (done) {
        //   ModelRole.aggregate([
        //     { $match: { idRole: req.user.role } },
        //     {
        //       $lookup: {
        //         from: "tfeedbacks",
        //         localField: "idRole",
        //         foreignField: "idRole",
        //         as: "feedback",
        //       },
        //     },
        //   ])
        //     .then((role) => done(null, role[0]))
        //     .catch((err) => done(err));
        // },

        // // 2. Génération du filtre
        // function (role, done) {
        //   let idRoles = role.feedback.map((x) => x.idFeedback);

        //   if (role.filterBy === "all") {
        //     return done(null, baseFilter);
        //   }

        //   if (["region", "shop"].includes(role.filterBy)) {
        //     return done(null, {
        //       ...baseFilter,
        //       [role.filterBy]: req.user.valueFilter,
        //       currentFeedback: { $in: idRoles },
        //     });
        //   }

        //   if (role.filterBy === "currentFeedback") {
        //     return done(null, {
        //       ...baseFilter,
        //       currentFeedback: { $in: idRoles },
        //     });
        //   }

        //   // Par défaut si aucun cas ne matche
        //   return done(null, baseFilter);
        // },

        // 3. Requête principale
        function (done) {
          ModelClient.aggregate([
            {
              $match: {
                month,
                actif: true,
                $or: [
                  {
                    feedback: { $in: ["Pending", "Rejected"] },
                  },
                  { currentFeedback: "Categorisation" },
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
              $project: {
                id: "$_id",
                currentfeedback: 1,
                idFeedback: "$currentfeedback.idFeedback",
                currentTitle: "$currentfeedback.title",
                changetotitle: "$fchangeto.title",
                appelles: 1,
                visites: 1,
                codeclient: 1,
                nomclient: 1,
                shop: 1,
                par: 1,
                submitedBy: 1,
              },
            },
          ])
            .then((result) => {
              done(null, result);
            })
            .catch((err) => done(err));
        },
      ],
      function (err, result) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Erreur lors de l'exécution de la requête." });
        }
        return res.status(200).json(result);
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur inattendue." });
  }
};
const PostArbitrage_Automatique = async (req, res, next) => {
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
              $match: { month, actif: true, currentFeedback: "Categorisation" },
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
                derniereappel: {
                  $arrayElemAt: [{ $reverseArray: "$appelles" }, 0],
                },
              },
            },
            {
              $addFields: {
                id: "$_id",
                codeclient: "$codeclient",
                visite: "$derniereVisite.demande.raison",
                appel: "$derniereappel.sioui_texte",
                shop: "$shop",
                nomclient: "$nomclient",
                currentTitle: "$currentfeedback.title",
                currentfeedback: "$currentfeedback.idFeedback",
                current_incharge: "$fcurrent_incharge",
                firstchangeto: "$changeto",
                changeto: "$fchangeto.idFeedback",
                changetotitle: "$fchangeto.title",
                par: "$par",
                submitedBy: "$submitedBy",
                feedback: "$feedback",
              },
            },

            {
              $project: {
                id: 1,
                codeclient: 1,
                currentTitle: 1,
                matchappelvisite: 1,
                changetotitle: 1,
                visites: 1,
                appel: 1,
                shop: 1,
                nomclient: 1,
                currentfeedback: 1,
                current_incharge: 1,
                changeto: 1,
                par: 1,
                submitedBy: 1,
                feedback: "Pending",
              },
            },
          ])
            .then((result) => {
              done(null, feedbacks, result);
            })
            .catch((err) => console.log(err));
        },
        function (feedbacks, result, done) {
          const returnFeedback = (client) => {
            if (client.visites.length > 0) {
              if (
                lodash.filter(client.visites, { "demandeur.fonction": "PO" })
                  .length > 0
              ) {
                let vmpo = lodash.filter(client.visites, {
                  "demandeur.fonction": "PO",
                });
                let lastvm = vmpo[vmpo.length - 1];
                if (
                  lodash.filter(feedbacks, {
                    idFeedback: lastvm[0].demande.raison,
                  }).length > 0
                ) {
                  return lodash.filter(feedbacks, {
                    idFeedback: lastvm[0].demande.raison,
                  })[0].idFeedback;
                } else {
                  return "Categorisation";
                }
              }
              if (
                client.visites.filter((x) =>
                  ["RS", "SM", "TL"].includes(x.demandeur.fonction)
                ).length > 0
              ) {
                let vm = client.visites.filter((x) =>
                  ["RS", "SM", "TL"].includes(x.demandeur.fonction)
                );
                let lastvm = vm[vm.length - 1];
                if (
                  lodash.filter(feedbacks, {
                    idFeedback: lastvm.demande.raison,
                  }).length > 0
                ) {
                  return lodash.filter(feedbacks, {
                    idFeedback: lastvm.demande.raison,
                  })[0].idFeedback;
                } else {
                  return "Categorisation";
                }
              }
              if (
                client.visites.filter(
                  (x) =>
                    !["RS", "SM", "TL", "PO"].includes(x.demandeur.fonction) &&
                    ["agent", "tech", "stagiaire", "AR"].includes(
                      x.demandeur.fonction
                    )
                ).length > 0
              ) {
                let vm = client.visites.filter((x) =>
                  ["agent", "tech", "stagiaire", "AR"].includes(
                    x.demandeur.fonction
                  )
                );
                let lastvm = vm[vm.length - 1];
                if (
                  lodash.filter(feedbacks, {
                    idFeedback: lastvm.demande.raison,
                  }).length > 0
                ) {
                  return lodash.filter(feedbacks, {
                    idFeedback: lastvm.demande.raison,
                  })[0].idFeedback;
                } else {
                  return "Categorisation";
                }
              }
            } else {
              return "Categorisation";
            }
          };

          if (result.length > 0) {
            async function updateClientsWithBulk() {
              const bulkoperation = result.map((client) => ({
                updateOne: {
                  filter: {
                    codeclient: client.codeclient,
                    month,
                    actif: true,
                  },
                  update: {
                    $set: {
                      feedback: "Approved",
                      currentFeedback: returnFeedback(client),
                      changeto: client.visite,
                      submitedBy: "System",
                    },
                    $push: {
                      Hist_Arbitrage: {
                        current_status: client.currentfeedback,
                        changeto: client.visite,
                        submitedBy: "System",
                        checkedBy: "System",
                        commentaire: "Submited by system",
                        feedback: "Approved",
                      },
                    },
                  },
                  upsert: true,
                  returnDocument: "after",
                },
              }));
              try {
                const result = await ModelClient.bulkWrite(bulkoperation);
              } catch (error) {}
            }
            updateClientsWithBulk();
            done(true);
          } else {
            done(true);
          }
        },
      ],
      function (err, result) {
        if (err) {
          return next();
        }
        next();
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const Arbitrage_File = async (req, res) => {
  try {
    const { data } = req.body;
    const { nom } = req.user;

    for (let i = 0; i < data.length; i++) {
      ModelClient.findByIdAndUpdate(
        data[i].id,
        {
          $set: {
            feedback: data[i].feedback,
            currentFeedback:
              data[i].feedback === "Approved"
                ? data[i].changeto
                : data[i].current_status,
          },
          $push: {
            Hist_Arbitrage: {
              current_status: data[i].current_status,
              changeto: data[i].changeto,
              submitedBy: data[i].submitedBy,
              checkedBy: nom,
              commentaire: data[i].commentaire,
              feedback: data[i].feedback,
            },
          },
        },
        { new: true }
      )
        .then(() => {})
        .catch(function (err) {
          console.log(err);
        });
    }
    return res.status(200).json("Done");
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  Arbitrage,
  PostArbitrage_Automatique,
  ReadArbitrage,
  Arbitrage_File,
};
