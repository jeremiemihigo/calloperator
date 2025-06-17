const ModelDecision = require("../../Models/DefaultTracker/Decision");
const { ObjectId } = require("mongodb");
const asyncLab = require("async");
const moment = require("moment");
const _ = require("lodash");
const ModelClient = require("../../Models/DefaultTracker/TableClient");

const AddDecision = async (req, res) => {
  try {
    const { codeclient, shop, commentaire, region, decision } = req.body;
    const { nom, validationdt } = req.user;
    if (!codeclient || !shop || !region || !decision) {
      return res.status(201).json("Veuillez renseigner les champs");
    }
    const month = moment(new Date()).format("MM-YYYY");
    ModelDecision.findOneAndUpdate(
      { codeclient, month },
      {
        $set: {
          codeclient,
          shop,
          region,
          decision,
          month,
          createdBy: nom,
          statut: validationdt ? "Approved" : "Pending",
        },
        $push: {
          validate: {
            last_statut: "Tracking_Ongoing",
            next_statut: "pending",
            commentaire,
            createdBy: nom,
          },
        },
      },
      { upsert: true, returnDocument: "after" }
    )
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
const VerificationDecision = async (req, res) => {
  try {
    const { id, commentaire, last_statut, next_statut } = req.body;
    const { nom } = req.user;
    ModelDecision.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          statut: next_statut,
        },
        $push: {
          validate: {
            last_statut,
            next_statut,
            commentaire,
            createdBy: nom,
          },
        },
      },
      { new: true }
    )
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(201).json("Error");
        }
      })
      .catch(function (error) {
        return res.status(201).json(JSON.stringify(error));
      });
  } catch (error) {
    return res.status(201).json(JSON.stringify(error));
  }
};
const ReadDecision = async (req, res) => {
  try {
    const month = moment(new Date()).format("MM-YYYY");
    ModelDecision.aggregate([
      { $match: { month } },
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
          as: "client",
        },
      },
      {
        $addFields: {
          nomclient: "$client.nomclient",
          par: "$client.par",
          id: "$_id",
        },
      },
      {
        $project: {
          decision: 1,
          createdBy: 1,
          nomclient: 1,
          par: 1,
          codeclient: 1,
          region: 1,
          id: 1,
          shop: 1,
          statut: 1,
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
const ChangeDecisionByFile = async (req, res) => {
  try {
    const { data } = req.body;
    const { nom } = req.user;
    for (let i = 0; i < data.length; i++) {
      ModelDecision.findOneAndUpdate(
        {
          _id: new ObjectId(data[i].id),
        },
        {
          $set: {
            statut: data[i].next_statut,
          },
          $push: {
            validate: {
              last_statut: data[i].last_statut,
              next_statut: data[i].next_statut,
              commentaire: data[i].commentaire,
              createdBy: nom,
            },
          },
        },
        { new: true }
      ).then((r) => {
        console.log(r);
      });
    }
    return res.status(200).json("Done");
  } catch (error) {}
};
const SubmitDecisionByFile = async (req, res) => {
  try {
    const { data } = req.body;
    const { nom, validationdt } = req.user;
    const month = moment(new Date()).format("MM-YYYY");

    asyncLab.waterfall([
      function (done) {
        async function updateClientsWithBulk() {
          const bulkoperation = data.map((client) => ({
            updateOne: {
              filter: {
                codeclient: client.codeclient,
                month,
              },
              update: {
                $set: {
                  codeclient: client.codeclient,
                  shop: client.shop,
                  region: client.region,
                  decision: client.decision,
                  month,
                  createdBy: nom,
                  statut: validationdt ? "Approved" : "Pending",
                },
                $push: {
                  validate: {
                    last_statut: "Tracking_Ongoing",
                    next_statut: "Pending",
                    commentaire: client.commentaire,
                    name: nom,
                  },
                },
              },
              returnDocument: "after",
            },
          }));
          try {
            const result = await ModelDecision.bulkWrite(bulkoperation);
            return res
              .status(200)
              .json(
                `${result.upsertedCount} insertion and ${result.modifiedCount} action(s) updated`
              );
          } catch (error) {
            console.log(error);
          }
        }
        updateClientsWithBulk();
      },

      function (clients, done) {
        if (validationdt) {
          async function updateClientsWithBulk() {
            const bulkoperation = data.map((client) => ({
              updateOne: {
                filter: {
                  codeclient: client.codeclient,
                  month: client.month,
                },
                update: {
                  $set: {
                    actif: false,
                  },
                },

                returnDocument: "after",
              },
            }));
            try {
              const result = await ModelClient.bulkWrite(bulkoperation);
              return res
                .status(200)
                .json(`End process for ${result.modifiedCount} customers`);
            } catch (error) {}
          }
          updateClientsWithBulk();
        } else {
          return res.status(200).json("Done");
        }
      },
    ]);

    return res.status(200).json(`${data.length} decisions enregistrées`);
  } catch (error) {}
};
const GraphiqueDecision = async (req, res) => {
  try {
    let month = moment(new Date()).format("MM-YYYY");
    const { filtre } = req.params;
    asyncLab.waterfall(
      [
        function (done) {
          ModelDecision.aggregate([
            { $match: { statut: "Approved", month } },
            {
              $group: {
                _id: {
                  title: filtre,
                  statut: "$decision",
                },
                total: { $sum: 1 },
              },
            },
            {
              $addFields: {
                action: "$_id.statut",
                title: "$_id.title",
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ])
            .then((result) => {
              if (result.length > 0) {
                let serie = [];
                let a = result.map((x) => x.action);
                let title = result.map((x) => x.title);
                let region = _.uniq(title);
                let actions = _.uniq(a);
                const returnData = (type) => {
                  let table = [];
                  for (let i = 0; i < region.length; i++) {
                    table.push(
                      result.filter(
                        (x) => x.action === type && x.title === region[i]
                      )[0]?.total || 0
                    );
                  }
                  return table;
                };
                for (let i = 0; i < actions.length; i++) {
                  serie.push({
                    name: actions[i],
                    data: returnData(actions[i]),
                  });
                }
                return res.status(200).json({ serie, title: region });
              }
            })
            .catch(function (err) {
              console.log(err);
            });
        },
      ],
      function (option, series) {
        return res.status(200).json({
          serie: [
            {
              name: "",
              data: series,
            },
          ],
          option,
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  AddDecision,
  SubmitDecisionByFile,
  GraphiqueDecision,
  VerificationDecision,
  ReadDecision,
  ChangeDecisionByFile,
};
