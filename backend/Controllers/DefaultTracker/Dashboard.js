const ModelClient = require("../../Models/DefaultTracker/TableClient");
const ModelRole = require("../../Models/DefaultTracker/Role");
const asyncLab = require("async");
const moment = require("moment");
const {
  returnMoisLetter,
  initialeSearch,
} = require("../../Static/Static_Function");
const lodash = require("lodash");
const modelPeriode = require("../../Models/Periode");
const ModelPoste = require("../../Models/Poste");
const ModelFeedback = require("../../Models/Feedback");
const ModelRapport = require("../../Models/Rapport");

const visitedMonth = (visites) => {
  if (visites.length === 0) {
    return { visitMonth: "No visits", lastfeedback: "No visits" };
  } else {
    let table = [];
    let lastfeedback = undefined;
    for (let i = 0; i < visites.length; i++) {
      table.push(returnMoisLetter(visites[i].demande.lot.split("-")[0]));
    }
    lastfeedback = visites[visites.length - 1].demande.raison;
    return {
      visitMonth: `${lodash.uniq(table).join(" & ")}`,
      lastfeedback: lastfeedback ? lastfeedback : "",
    };
  }
};
const feedbackRole = (feedback, role) => {
  if (feedback.length === 0) {
    return "";
  } else {
    let feedbackRole = feedback.filter((x) => x.role === role);
    if (feedbackRole.length >= 1) {
      return feedbackRole[feedbackRole.length - 1].newFeedback;
    } else {
      return "";
    }
  }
};
const Rapport = async (req, res) => {
  try {
    asyncLab.waterfall(
      [
        function (done) {
          ModelRole.find({}, { idRole: 1, _id: 0 })
            .lean()
            .then((result) => {
              let roles = result.map((x) => x.idRole);
              done(null, roles);
            })
            .catch(function (err) {
              console.log(err);
            });
        },
        function (role, done) {
          ModelClient.aggregate([
            {
              $lookup: {
                from: "rapports",
                localField: "codeclient",
                foreignField: "codeclient",
                as: "visites",
              },
            },
          ]).then((result) => {
            let newData = result.map(function (x) {
              return {
                ...x,
                visiteMonth: visitedMonth(x.visites).visitMonth,
                last_feedback_VM: visitedMonth(x.visites).lastfeedback,
              };
            });
            for (let i = 0; i < role.length; i++) {
              for (let y = 0; y < newData.length; y++) {
                newData[y][role[i]] = feedbackRole(
                  newData[y].feedback,
                  role[i]
                );
              }
            }
            done(newData, role);
          });
        },
      ],
      function (result, role) {
        return res.status(200).json({ result, role });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const ClientVisited = async (req, res) => {
  const mois = moment(new Date()).format("MM-YYYY");
  try {
    modelPeriode
      .aggregate([
        { $unwind: "$objectif.data" },
        {
          $addFields: {
            codeclient: "$objectif.data.codeclient",
            codeAgent: "$objectif.data.codeAgent",
          },
        },
        {
          $project: {
            codeclient: 1,
            codeAgent: 1,
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
        { $unwind: "$agent" },
        {
          $addFields: {
            region: "$agent.codeZone",
            shop: "$agent.idShop",
          },
        },
        {
          $project: {
            codeclient: 1,
            codeAgent: 1,
            region: 1,
            shop: 1,
          },
        },
        {
          $lookup: {
            from: "rapports",
            let: { codeclient: "$codeclient" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$codeclient", "$$codeclient"] },
                      { $eq: ["$demande.lot", mois] },
                    ],
                  },
                },
              },
            ],
            as: "visite",
          },
        },
      ])
      .then((result) => {
        return res.status(200).json(result);
      });
  } catch (error) {
    console.log(error);
  }
};
// const StatusDashboard = async (req, res) => {
//   const recherche = req.recherche;
//   const { match } = req.body;
//   try {
//     asyncLab.waterfall(
//       [
//         function (done) {
//           ModelClient.aggregate([
//             { $match: match ? match : recherche },
//             { $group: { _id: "$currentFeedback", total: { $sum: 1 } } },
//             {
//               $lookup: {
//                 from: "tfeedbacks",
//                 localField: "_id",
//                 foreignField: "idFeedback",
//                 as: "feedback",
//               },
//             },
//             { $unwind: "$feedback" },
//             {
//               $lookup: {
//                 from: "roles",
//                 localField: "feedback.idRole",
//                 foreignField: "idRole",
//                 as: "role",
//               },
//             },
//             {
//               $lookup: {
//                 from: "postes",
//                 localField: "feedback.idRole",
//                 foreignField: "id",
//                 as: "poste",
//               },
//             },
//             { $sort: { total: -1 } },
//             {
//               $project: {
//                 id: "$_id",
//                 status: "$feedback.title",
//                 total: 1,
//                 poste: 1,
//                 role: 1,
//               },
//             },
//           ])
//             .then((result) => {
//               done(result);
//             })
//             .catch(function (err) {
//               return res.status(201).json(JSON.stringify(err));
//             });
//         },
//       ],
//       function (result) {
//         return res.status(200).json(result);
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };
// const GraphiqueClient = async (req, res, next) => {
//   try {
//     const month = moment(new Date()).format("MM-YYYY");
//     const recherche = req.recherche;
//     const { match } = req.body;
//     asyncLab.waterfall([
//       function (done) {
//         let recherches = match ? match : recherche;
//         ModelClient.aggregate([
//           { $match: recherches },
//           {
//             $lookup: {
//               from: "actions",
//               let: { codeclient: "$codeclient", mois: month },
//               pipeline: [
//                 {
//                   $match: {
//                     $expr: {
//                       $and: [
//                         { $eq: ["$codeclient", "$$codeclient"] },
//                         { $eq: ["$month", month] },
//                         { $eq: ["$statut", "APPROVED"] },
//                       ],
//                     },
//                   },
//                 },
//               ],
//               as: "actions",
//             },
//           },
//           {
//             $lookup: {
//               from: "rapports",
//               let: { codeclient: "$codeclient" },
//               pipeline: [
//                 {
//                   $match: {
//                     $expr: {
//                       $and: [
//                         { $eq: ["$codeclient", "$$codeclient"] },
//                         { $eq: ["$demande.lot", month] },
//                       ],
//                     },
//                   },
//                 },
//               ],
//               as: "visite",
//             },
//           },
//           {
//             $lookup: {
//               from: "pfeedback_calls",
//               let: { codeclient: "$codeclient" },
//               pipeline: [
//                 {
//                   $match: {
//                     $expr: {
//                       $and: [
//                         { $eq: ["$codeclient", "$$codeclient"] },
//                         { $eq: ["$month", month] },
//                         { $eq: ["$type", "Reachable"] },
//                       ],
//                     },
//                   },
//                 },
//               ],
//               as: "appel",
//             },
//           },
//           {
//             $addFields: {
//               taille_action: { $size: "$actions" },
//               taille_visite: { $size: "$visite" },
//               taille_appel: { $size: "$appel" },
//             },
//           },
//           {
//             $group: {
//               _id: "$month", // Pas besoin de regrouper par un champ spécifique
//               action: {
//                 $sum: {
//                   $cond: [{ $gt: ["$taille_action", 0] }, 1, 0],
//                 },
//               },
//               visite: {
//                 $sum: {
//                   $cond: [{ $gt: ["$taille_visite", 0] }, 1, 0],
//                 },
//               },
//               appel: {
//                 $sum: {
//                   $cond: [{ $gt: ["$taille_appel", 0] }, 1, 0],
//                 },
//               },
//             },
//           },
//         ])
//           .then((result) => {
//             if (result.length > 0) {
//               req.client = { result, recherche: recherches };
//               next();
//             } else {
//               return res
//                 .status(200)
//                 .json({ nombre: 0, visite: 0, action: 0, appel: 0 });
//             }
//           })
//           .catch(function (err) {
//             console.log(err);
//           });
//       },
//     ]);
//   } catch (error) {
//     console.log(error);
//   }
// };
// const TauxValidation = async (req, res) => {
//   try {
//     const { result, recherche } = req.client;
//     const month = moment(new Date()).format("MM-YYYY");
//     let datasearch = recherche;
//     datasearch.month = month;
//     let analyse = result.filter((x) => x._id === month)[0];
//     const nombre = await ModelClient.find(datasearch).count();

//     return res.status(200).json({
//       nombre,
//       visite: ((analyse.visite * 100) / nombre).toFixed(0),
//       action: parseInt((analyse.action * 100) / nombre).toFixed(0),
//       appel: parseInt((analyse.appel * 100) / nombre).toFixed(0),
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
const MesCriteredeRecherche = (req, res, next) => {
  try {
    const { poste, valuefilter } = req.user;
    const month = moment(new Date()).format("MM-YYYY");
    asyncLab.waterfall(
      [
        function (done) {
          ModelPoste.aggregate([
            { $match: { id: poste } },
            {
              $lookup: {
                from: "roles",
                localField: "idDepartement",
                foreignField: "idRole",
                as: "departement",
              },
            },
            { $unwind: "$departement" },
          ]).then((result) => {
            if (result) {
              done(null, result[0]);
            } else {
              return res
                .status(201)
                .json("No position found; you can contact the administrator");
            }
          });
        },
        function (department, done) {
          ModelFeedback.aggregate([
            { $unwind: "$idRole" },
            {
              $match: {
                $or: [
                  { idRole: poste },
                  {
                    idRole: department.departement.idRole,
                    typecharge: "departement",
                  },
                ],
              },
            },
            { $project: { idFeedback: 1 } },
          ]).then((result) => {
            if (result.length > 0) {
              let table = result.map((x) => x.idFeedback);
              done(null, department, table);
            } else {
              done(null, department, result);
            }
          });
        },
        function (result_poste, feedbacks, done) {
          if (result_poste.filterby === "shop") {
            done({
              shop: { $in: valuefilter },
              month,
              actif: true,
              currentFeedback: { $in: feedbacks },
            });
          }
          if (result_poste.filterby === "region") {
            done({
              region: { $in: valuefilter },
              month,
              actif: true,
              currentFeedback: { $in: feedbacks },
            });
          }
          if (result_poste.filterby === "overall") {
            done({ month, actif: true });
          }
        },
      ],
      function (recherche) {
        req.recherche = recherche;
        req.user = req.user;
        next();
      }
    );
  } catch (error) {}
};
const ReadValidation = (req, res, next) => {
  try {
    const { codeAgent, fonction, idvm } = req.user;
    const month = moment().format("MM-YYYY");
    const lastmatch =
      fonction === "superUser" ? {} : { "historique.submitedBy": codeAgent };

    const project = {
      id: "$historique._id",
      idFeedback: 1,
      codeclient: 1,
      nomclient: 1,
      par: 1,
      region: 1,
      shop: 1,
      decision: 1,
      actions: 1,
      submitedBy: "$agent.nom",
      currentFeedback: "$historique.lastfeedback",
      nextfeedback: "$historique.nextfeedback",
      time: "$historique.createdAt",
      departement: "$historique.departement",
      sla: "$historique.sla",
      poste: "$historique.poste",
      idHistorique: "$historique._id",
    };

    asyncLab.waterfall(
      [
        function (done) {
          ModelClient.aggregate([
            { $match: { month, historique: { $not: { $size: 0 } } } },
            { $unwind: "$historique" },
            { $match: lastmatch },
            {
              $lookup: {
                from: "agentadmins",
                localField: "historique.submitedBy",
                foreignField: "codeAgent",
                as: "agent",
              },
            },
            { $unwind: "$agent" },

            {
              $lookup: {
                from: "decisions",
                localField: "historique._id",
                foreignField: "id",
                as: "decision",
              },
            },
            { $project: project },
          ])
            .then((result) => {
              if (fonction !== "superUser") {
                req.validation = {
                  validation: result,
                };
                next();
              } else {
                done(null, result);
              }
            })
            .catch(function (err) {
              console.log(err);
            });
        },
        function (result, done) {
          const idProcessOfficer = "1750079717209";
          ModelClient.aggregate([
            {
              $lookup: {
                from: "tfeedbacks",
                localField: "currentFeedback",
                foreignField: "idFeedback",
                as: "feedback",
              },
            },
            { $unwind: "$feedback" },
            { $unwind: "$feedback.idRole" },
            { $match: { actif: true, "feedback.idRole": idProcessOfficer } },
            { $addFields: { id: "$_id" } },
            ...initialeSearch,
          ]).then((process) => {
            done(null, result, process);
          });
        },
        //Visites
        function (result, process, done) {
          const project = {
            codeclient: 1,
            PayementStatut: 1,
            clientStatut: 1,
            name: "$demandeur.nom",
            fonction: "$demandeur.fonction",
            nomClient: 1,
            consExpDays: 1,
            id: "$_id",
            shop: "$shop.shop",
            region: "$region.denomination",
            date: "$demande.updatedAt",
            feedback: "$demande.raison",
            indt: 1,
          };
          const postevmstaff = ["ZBM", "PO", "RS", "SM", "TL"];
          const lastmatch =
            fonction === "superUser"
              ? {
                  "demandeur.fonction": { $in: postevmstaff },
                  $or: [
                    { idZone: "7778", "demandeur.fonction": "PO" },
                    { idShop: { $in: ["sh9", "sh2"] } },
                  ],

                  "demande.lot": month,
                }
              : { "demande.lot": month, "demandeur.codeAgent": idvm };
          ModelRapport.aggregate([
            { $match: lastmatch },
            {
              $lookup: {
                from: "zones",
                localField: "idZone",
                foreignField: "idZone",
                as: "region",
              },
            },
            { $unwind: "$region" },
            {
              $lookup: {
                from: "shops",
                localField: "idShop",
                foreignField: "idShop",
                as: "shop",
              },
            },
            { $unwind: "$shop" },
            {
              $lookup: {
                from: "tclients",
                localField: "codeclient",
                foreignField: "codeclient",
                as: "indt",
              },
            },
            {
              $lookup: {
                from: "tclients",
                let: { codeclient: "$codeclient" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$codeclient", "$$codeclient"] },
                          { $eq: ["$month", month] },
                        ],
                      },
                    },
                  },
                ],
                as: "indt",
              },
            },
            { $project: project },
          ]).then((visites) => {
            done(result, process, visites);
          });
        },
      ],
      function (result, process, visites) {
        req.validation = {
          validation: result,
          po: process,
          visites,
        };
        next();
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  Rapport,
  ClientVisited,
  MesCriteredeRecherche,
  ReadValidation,
  // GraphiqueClient,
  // TauxValidation,
  // StatusDashboard,
};
