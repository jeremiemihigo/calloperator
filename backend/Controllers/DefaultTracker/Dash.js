const ModelClient = require("../../Models/DefaultTracker/TableClient");
const moment = require("moment");
const lodash = require("lodash");
const ModelObjectif = require("../../Models/DefaultTracker/Objectif");
const asyncLab = require("async");
const ModelAgent = require("../../Models/Agent");
const ModelRapport = require("../../Models/Rapport");
const { returnLastFirstDate } = require("../../Static/Static_Function");

//My customer
const ClientAttente = async (req, res) => {
  try {
    ModelClient.aggregate([
      { $match: { actif: true } },
      // { $group: { _id: "$currentFeedback", nombre: { $sum: 1 } } },
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
      {
        $lookup: {
          from: "roles",
          localField: "feedback.idRole",
          foreignField: "idRole",
          as: "role",
        },
      },
      { $unwind: "$role" },
      { $addFields: { departement: "$role.title" } },
      { $group: { _id: "$departement", nombre: { $sum: 1 } } },
    ]).then((result) => {
      let serie = [];
      let label = [];
      for (let i = 0; i < result.length; i++) {
        serie.push(result[i].nombre);
        label.push(result[i]._id);
      }
      return res.status(200).json({ serie, label });
    });
  } catch (error) {
    console.log(error);
  }
};
const Inactif_thisMonth = async (req, res) => {
  try {
    const { search } = req.params;
    const month = moment(new Date()).format("MM-YYYY");
    ModelClient.aggregate([
      {
        $match: {
          month,
        },
      },
      {
        $group: {
          _id: { title: search, actif: "$actif" },
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          titre: "$_id.title",
          actif: "$_id.actif",
        },
      },
      { $project: { _id: 0 } },
    ])
      .then((result) => {
        let title = lodash.uniq(result.map((x) => x.titre));
        let process = [];
        let not_process = [];
        for (let i = 0; i < title.length; i++) {
          process.push(
            result.filter((x) => x.titre === title[i] && x.actif)[0]?.count || 0
          );
          not_process.push(
            result.filter((x) => x.titre === title[i] && !x.actif)[0]?.count ||
              0
          );
        }
        return res.status(200).json({ process, not_process, title });

        // let serie = [];
        // let label = [];
        // for (let i = 0; i < result.length; i++) {
        //   label.push(result[i]._id ? "In Process" : "End Process");
        //   serie.push(result[i].total);
        // }
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
const Analyse_Dash_All = async (req, res) => {
  try {
    const { recherche, date } = req.body;
    let data = { ...recherche, active: true };

    const currentDate = new Date(date);
    currentDate.setDate(1);
    const l = currentDate.toISOString().split("T")[0];
    const { lastDate, firstDate } = returnLastFirstDate(date);
    const lastNowDate = new Date(l);
    const today = new Date(new Date(date).toISOString().split("T")[0]);
    const month = moment().format("MM-YYYY");

    asyncLab.waterfall(
      [
        //je cherche les agents
        function (done) {
          ModelAgent.aggregate([
            { $match: data },
            {
              $lookup: {
                from: "rapports",
                let: {
                  codeAgent: "$codeAgent",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$demandeur.codeAgent", "$$codeAgent"] },
                          { $lte: ["$dateSave", lastDate] },
                          { $gte: ["$dateSave", firstDate] },
                        ],
                      },
                    },
                  },
                ],
                as: "this_mois",
              },
            },
            {
              $lookup: {
                from: "rapports",
                let: {
                  codeAgent: "$codeAgent",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$demandeur.codeAgent", "$$codeAgent"] },
                          { $lte: ["$dateSave", today] },
                          { $gte: ["$dateSave", lastNowDate] },
                        ],
                      },
                    },
                  },
                ],
                as: "last_mois",
              },
            },
            {
              $addFields: {
                this_month: { $size: "$this_mois" },
                last_month: { $size: "$last_mois" },
              },
            },
            {
              $project: { this_month: 1, last_month: 1, codeAgent: 1, _id: 0 },
            },
          ])
            .then((result) => {
              if (result.length > 0) {
                done(null, result);
              } else {
                return res.status(201).json("Aucun agent retrouve");
              }
            })
            .catch(function (error) {
              return res.status(201).json(error.message);
            });
        },
        function (lescodes, done) {
          return res.status(200).json(lescodes);
        },

        function (lescodes, done) {
          ModelObjectif.aggregate([
            { $match: { codeAgent: { $in: lescodes } } },
            {
              $lookup: {
                from: "rapports",
                let: {
                  codeclient: "$codeclient",
                  codeAgent: "$codeAgent",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$codeclient", "$$codeclient"] },
                          { $eq: ["$demande.lot", month] },
                          { $eq: ["$demandeur.codeAgent", "$$codeAgent"] },
                        ],
                      },
                    },
                  },
                ],
                as: "visites",
              },
            },
            {
              $lookup: {
                from: "actions",
                let: { codeclient: "$codeclient", codeAgent: "$codeAgent" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$codeclient", "$$codeclient"] },
                          { $eq: ["$month", month] },
                          { $eq: ["$statut", "Approved"] },
                          { $eq: ["$codeAgent", "$$codeAgent"] },
                        ],
                      },
                    },
                  },
                ],
                as: "action",
              },
            },
          ])
            .then((result) => {
              let table = [];
              for (let i = 0; i < lescodes.length; i++) {
                table.push({
                  codeAgent: lescodes[i],
                  visite: result.filter(
                    (x) =>
                      x.visites.length > 0 &&
                      x.demandeur.codeAgent === lescodes[i]
                  ),
                  action: result.filter(
                    (x) => x.action.length > 0 && x.codeAgent === lescodes[i]
                  ),
                  non_action: result.filter(
                    (x) => x.action.length === 0 && x.codeAgent === lescodes[i]
                  ),
                });
              }
              done(table);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ error: "Erreur interne du serveur" });
            });
        },
      ],
      function (table) {
        return res.status(200).json(table);
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

module.exports = {
  ClientAttente,
  Inactif_thisMonth,
  Analyse_Dash_All,
};
