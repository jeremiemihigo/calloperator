const ModelClient = require("../../Models/DefaultTracker/TableClient");
const asyncLab = require("async");
const { ObjectId } = require("mongodb");
const lodash = require("lodash");
const moment = require("moment");
const ModelPoste = require("../../Models/Poste");
const ModelFeedback = require("../../Models/Feedback");

let initialeSearch = [
  {
    $lookup: {
      from: "tfeedbacks",
      localField: "currentFeedback",
      foreignField: "idFeedback",
      as: "tfeedback",
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
        $arrayElemAt: [
          {
            $reverseArray: "$appelles", // Renverse l'ordre du tableau
          },
          0,
        ],
      },
    },
  },
  { $unwind: "$tfeedback" },
  {
    $lookup: {
      from: "roles",
      localField: "tfeedback.idRole",
      foreignField: "idRole",
      as: "incharge",
    },
  },

  {
    $project: {
      codeclient: 1,
      nomclient: 1,
      decision: 1,
      month: 1,
      id: 1,
      shop: 1,
      region: 1,
      visites: 1,
      actif: 1,
      action: 1,
      par: 1,
      currentFeedback: 1,
      submitedBy: 1,
      tfeedback: 1,
      derniereappel: 1,
      appel: 1,
      fullDate: 1,
      statut_decision: 1,
      incharge: 1,
      statut: 1,
      feedback: 1,
    },
  },
];

let searchData = [
  {
    $lookup: {
      from: "tfeedbacks",
      localField: "currentFeedback",
      foreignField: "idFeedback",
      as: "tfeedback",
    },
  },

  { $unwind: "$tfeedback" },
];
let searchData2 = [
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
    $lookup: {
      from: "roles",
      localField: "tfeedback.idRole",
      foreignField: "idRole",
      as: "incharge",
    },
  },
  {
    $project: {
      codeclient: 1,
      nomclient: 1,
      decision: 1,
      month: 1,
      id: 1,
      shop: 1,
      region: 1,
      action: 1,
      par: 1,
      currentFeedback: 1,
      submitedBy: 1,
      tfeedback: 1,
      visites: 1,
      derniereappel: 1,
      appel: 1,
      fullDate: 1,
      statut_decision: 1,
      incharge: 1,
      statut: 1,
      feedback: 1,
    },
  },
];

const AddClientDT = async (req, res) => {
  try {
    const { data } = req.body;
    const { nom } = req.user;
    let month = moment(new Date()).format("MM-YYYY");
    const client = data.map((x) => {
      return {
        ...x,
        month,
        submitedBy: nom,
      };
    });
    if (client.length <= 0) {
      return res.status(201).json("Aucun client renseigné");
    }
    asyncLab.waterfall(
      [
        function (done) {
          ModelClient.insertMany(client)
            .then((response) => {
              done(response);
            })
            .catch(function (err) {
              return res.status(201).json("Error " + err);
            });
        },
      ],
      function (response) {
        if (response) {
          return res.status(200).json("Opération effectuée");
        } else {
          return res.status(201).json("Erreur");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const ChangeStatus = async (req, res, next) => {
  try {
    const { nom, validationdt } = req.user;

    const { id, lastFeedback, nextFeedback } = req.body;

    if (!id || !lastFeedback || !nextFeedback) {
      return res.status(404).json("Veuillez renseigner les champs");
    }
    asyncLab.waterfall(
      [
        function (done) {
          ModelClient.findOneAndUpdate(
            {
              _id: new ObjectId(id),
              currentFeedback: lastFeedback,
            },
            {
              $set: {
                currentFeedback: validationdt ? nextFeedback : lastFeedback,
                feedback: validationdt ? "Approved" : "Pending",
                changeto: nextFeedback,
                submitedBy: nom,
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
          req.recherche = result.codeclient;
          next();
        } else {
          return res.status(404).json(`Le client n'est plus à votre niveau`);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const ChangeByFile = async (req, res) => {
  try {
    const { data } = req.body;
    //Data : codeclient, nextFeedback,lasFeedback
    const { role, nom, validationdt } = req.user;
    const clients = data.map((x) => {
      return x.codeclient;
    });
    const customers = lodash.uniq(clients);
    const month = moment(new Date()).format("MM-YYYY");

    asyncLab.waterfall([
      function (done) {
        ModelClient.aggregate([
          {
            $match: { codeclient: { $in: customers }, actif: true, month },
          },
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
            $match: { "feedback.idRole": role },
          },
        ])
          .then((result) => {
            if (result.length - data.length !== 0) {
              return res.status(201).json({
                result,
                message: "Some customers are not on your dashboard",
              });
            } else {
              //codeclient, idFeedback, nextFeedback
              let donner = result.map((client) => {
                return {
                  codeclient: client.codeclient,
                  idFeedback: client.currentFeedback,
                  nextFeedback: data.filter(
                    (x) => x.codeclient === client.codeclient
                  )[0]?.idFeedback,
                };
              });
              done(null, donner);
            }
          })
          .catch(function (err) {
            console.log(err);
          });
      },
      function (result, done) {
        async function updateClientsWithBulk() {
          const bulkOperations = result.map((client) => ({
            updateOne: {
              filter: {
                codeclient: client.codeclient,
                currentFeedback: client.idFeedback,
                actif: true,
              },
              update: {
                $set: {
                  currentFeedback: validationdt
                    ? client.nextFeedback
                    : client.idFeedback,
                  feedback: validationdt ? "Approved" : "Pending",
                  changeto: client.nextFeedback,
                  submitedBy: nom,
                },
              },
            },
          }));

          try {
            const result = await ModelClient.bulkWrite(bulkOperations);

            return res
              .status(200)
              .json(`Mises à jour réussies : ${result.modifiedCount} clients`);
          } catch (err) {
            return res
              .status(201)
              .json("Error during updates : " + err.message);
          }
        }
        updateClientsWithBulk();
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};
const ReadFilterClient = async (req, res) => {
  try {
    const { data, defaultv } = req.body;
    const { valuefilter, poste } = req.user;

    console.log(data, defaultv, valuefilter, poste);

    asyncLab.waterfall(
      [
        //Read role
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
          let month = moment(new Date()).format("MM-YYYY");
          let filtre = data;
          filtre.month = month;
          filtre.action = { $in: ["No_Action", "Rejected"] };
          filtre.statut_decision = "Tracking_Ongoing";
          filtre.feedback = { $in: ["Rejected", "Approved", "success"] };
          filtre.actif = true;

          if (result_poste.filterby === "region") {
            filtre.region = { $in: valuefilter };
            filtre.currentFeedback = { $in: feedbacks };
          }
          if (result_poste.filterby === "shop") {
            filtre.shop = { $in: valuefilter };
            filtre.currentFeedback = { $in: feedbacks };
          }

          done(null, filtre);
        },
        function (filtre, done) {
          ModelClient.aggregate(
            defaultv
              ? [{ $match: filtre }, ...initialeSearch]
              : [...searchData, { $match: filtre }, ...searchData2]
          )
            .then((result) => {
              done(null, result);
            })
            .catch(function (err) {
              return res.status(404).json(err);
            });
        },
        function (result, done) {
          done(result);
        },
      ],
      function (result) {
        return res.status(200).json({
          client: result,
          dateServer: new Date(),
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const ReadAllClient = async (req, res) => {
  try {
    asyncLab.waterfall(
      [
        //Read role

        function (done) {
          let month = moment(new Date()).format("MM-YYYY");
          ModelClient.aggregate([{ $match: { month } }, ...initialeSearch])
            .then((result) => {
              done(null, result);
            })
            .catch(function (err) {
              return res.status(404).json(err);
            });
        },
        function (result, done) {
          done(result);
        },
      ],
      function (result) {
        return res.status(200).json({
          client: result,
          dateServer: new Date(),
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const Appel = async (req, res) => {
  try {
    const { data } = req.body;
    let month = moment(new Date()).format("MM-YYYY");
    if (data.length === 0) {
      return res.status(201).json("Error");
    }
    for (let i = 0; i < data.length; i++) {
      ModelClient.findOneAndUpdate(
        {
          codeclient: data[i].codeclient,
          actif: true,
          month,
        },
        {
          $set: {
            appel: data[i].feedback,
          },
        }
      ).then(() => {});
    }
    return res.status(200).json("Done");
  } catch (error) {}
};
const ReadClientAfterChange = async (req, res) => {
  try {
    const recherche = req.recherche;
    ModelClient.aggregate([
      { $match: { codeclient: recherche, actif: true } },
      {
        $lookup: {
          from: "tfeedbacks",
          localField: "currentFeedback",
          foreignField: "idFeedback",
          as: "tfeedback",
        },
      },
      { $unwind: "$tfeedback" },
      {
        $unwind: "$tfeedback.idRole",
      },
      {
        $lookup: {
          from: "rapports",
          localField: "codeclient",
          foreignField: "codeclient",
          as: "visites",
        },
      },
    ])
      .then((result) => {
        if (result.length > 0) {
          return res.status(200).json(result[0]);
        } else {
          return res.status(200).json({});
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
const ReadCertainClient = async (req, res) => {
  try {
    const { data } = req.body;
    let month = moment(new Date()).format("MM-YYYY");
    ModelClient.aggregate([
      { $match: { codeclient: { $in: data }, month } },
      {
        $lookup: {
          from: "tfeedbacks",
          localField: "currentFeedback",
          foreignField: "idFeedback",
          as: "tfeedback",
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
    ])
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
const ChangeStatusOnly = async (req, res) => {
  try {
    const { id, data } = req.body;
    if (!id || !data) {
      return;
    }
    ModelClient.findByIdAndUpdate(id, { $set: data }, { new: true })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        return res.status(201).json(error.message);
      });
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
//Modification

module.exports = {
  AddClientDT,
  ChangeStatus,
  ReadAllClient,
  Appel,
  ReadClientAfterChange,
  ReadCertainClient,
  ChangeStatusOnly,
  ChangeByFile,
  ReadFilterClient,
};
