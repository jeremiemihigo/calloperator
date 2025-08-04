const ModelVerification = require("../../Models/DefaultTracker/Verification");
const moment = require("moment");
const TableClient = require("../../Models/DefaultTracker/TableClient");
const asyncLab = require("async");
const ModelFeedback = require("../../Models/Feedback");
const ModelPoste = require("../../Models/Poste");

// const ReadByStatus = async (req, res) => {
//   try {
//     const { status } = req.params;
//     const recherche = req.recherche;
//     const status_ = ["PO", "SM", "RS", "ZBM", "TL"];

//     let filter = recherche;
//     filter.status = status;
//     ModelVerification.aggregate([
//       {
//         $match: filter,
//       },
//       {
//         $lookup: {
//           from: "rapports",
//           localField: "idvisite",
//           foreignField: "idDemande",
//           as: "visite",
//         },
//       },
//       {
//         $lookup: {
//           from: "rapports",
//           let: { codeclient: "$codeclient" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$codeclient", "$$codeclient"] },
//                     { $in: ["$demandeur.fonction", status_] },
//                   ],
//                 },
//               },
//             },
//           ],
//           as: "allvisites",
//         },
//       },

//       { $unwind: "$visite" },
//       {
//         $project: {
//           codeclient: 1,
//           nomclient: 1,
//           region: 1,
//           allvisites: 1,
//           shop: 1,
//           month: 1,
//           status: 1,
//           id: "$_id",
//           confirmed_by: 1,
//           par: 1,
//           date: "$visite.demande.updatedAt",
//           agentname: "$visite.demandeur.nom",
//           codeAgent: "$visite.demandeur.codeAgent",
//           feedback: 1,
//           feedbackfield: 1,
//         },
//       },
//     ])
//       .then((result) => {
//         console.log(result.filter((x) => x.allvisites.length > 0).length);
//         return res.status(200).json(result);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };
const FilterFeedback = async (req, res, next) => {
  try {
    const { valuefilter, poste } = req.user;

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
            if (result.length > 0) {
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
          let filtre = { actif: true };
          filtre.month = month;
          if (result_poste.filterby === "region") {
            filtre.region = { $in: valuefilter };
            filtre.currentFeedback = { $in: feedbacks };
          }
          if (result_poste.filterby === "shop") {
            filtre.shop = { $in: valuefilter };
            filtre.currentFeedback = { $in: feedbacks };
          }

          done(filtre);
        },
      ],
      function (filter) {
        if (filter) {
          req.recherche = filter;
          next();
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  // ReadByStatus,
  FilterFeedback,
};
