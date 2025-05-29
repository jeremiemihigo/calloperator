const ModelClient = require("../../Models/DefaultTracker/TableClient");
const ModelRole = require("../../Models/DefaultTracker/Role");
const asyncLab = require("async");
const moment = require("moment");

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
        function (done) {
          ModelRole.aggregate([
            { $match: { idRole: req.user.role } },
            {
              $lookup: {
                from: "tfeedbacks",
                localField: "idRole",
                foreignField: "idRole",
                as: "feedback",
              },
            },
          ])
            .then((role) => done(null, role[0]))
            .catch((err) => done(err));
        },

        // 2. Génération du filtre
        function (role, done) {
          console.log(role);
          let idRoles = role.feedback.map((x) => x.idFeedback);

          let baseFilter = {
            feedback: { $in: ["Pending", "Rejected"] },
          };

          if (role.filterBy === "all") {
            return done(null, baseFilter);
          }

          if (["region", "shop"].includes(role.filterBy)) {
            return done(null, {
              ...baseFilter,
              [role.filterBy]: req.user.valueFilter,
              currentFeedback: { $in: idRoles },
            });
          }

          if (role.filterBy === "currentFeedback") {
            return done(null, {
              ...baseFilter,
              currentFeedback: { $in: idRoles },
            });
          }

          // Par défaut si aucun cas ne matche
          return done(null, baseFilter);
        },

        // 3. Requête principale
        function (filter, done) {
          ModelClient.aggregate([
            { $match: { month, actif: true } },

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
                derniereVisite: {
                  $arrayElemAt: [{ $reverseArray: "$visites" }, 0],
                },
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
                matchappelvisite: {
                  $cond: {
                    if: {
                      $and: [
                        {
                          $ne: ["$derniereVisite", null],
                        },
                        {
                          $ne: ["$derniereappel", null],
                        },
                        {
                          $eq: [
                            "$derniereVisite.demande.raison",
                            "$derniereappel.sioui_texte",
                          ],
                        },
                      ],
                    },
                    then: true,
                    else: false,
                  },
                },
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
              $match: {
                $or: [
                  {
                    matchappelvisite: true,
                    visite: { $exists: true },
                    appel: { $exists: true },
                    firstchangeto: { $exists: false },
                  },
                  filter,
                ],
              },
            },
            {
              $project: {
                id: 1,
                codeclient: 1,
                currentTitle: 1,
                matchappelvisite: 1,
                changetotitle: 1,
                visite: 1,
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
              console.log(result);
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
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur inattendue." });
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
module.exports = { Arbitrage, ReadArbitrage, Arbitrage_File };
