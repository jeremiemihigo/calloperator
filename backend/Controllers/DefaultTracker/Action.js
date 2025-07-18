const moment = require("moment");
const ModelAction = require("../../Models/DefaultTracker/Action");
const asyncLab = require("async");
const { ObjectId } = require("mongodb");
const ModelClient = require("../../Models/DefaultTracker/TableClient");
const _ = require("lodash");

const AddAction = async (req, res) => {
  try {
    const { data } = req.body;
    const { nom, validationdt } = req.user;
    if (data && data.length === 0) {
      return res.status(201).json("Error");
    }
    let month = moment(new Date()).format("MM-YYYY");
    let les = data.map(function (x) {
      return {
        ...x,
        month,
        savedBy: nom,
        statut: validationdt ? "Approved" : "Pending",
      };
    });

    asyncLab.waterfall([
      function (done) {
        ModelAction.insertMany(les)
          .then((result) => {
            done(null, result);
          })
          .catch(function (err) {
            return res.status(201).json(JSON.stringify(err.message));
          });
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
  } catch (error) {
    return res.status(201).json(JSON.stringify(error));
  }
};
const AddOneAction = async (req, res) => {
  try {
    const { codeclient, shop, region, action, codeAgent, commentaire } =
      req.body;
    const { nom, validationdt } = req.user;
    const month = moment(new Date()).format("MM-YYYY");
    if (!codeclient || !shop || !region || !action) {
      return res.status(201).json("Veuillez renseigner les champs");
    }

    ModelAction.findOneAndUpdate(
      {
        codeclient,
        month,
      },
      {
        $set: {
          codeclient,
          month,
          codeAgent,
          shop,
          region,
          savedBy: nom,
          action,
          statut: validationdt ? "Approved" : "Pending",
        },
        $push: {
          last_statut: "No_Action",
          next_statut: validationdt ? "Approved" : "Pending",
          commentaire,
          name: nom,
        },
      },
      { upsert: true, returnDocument: "after" }
    )
      .then((result) => {
        if (result) {
          return res.status(200).json("Done");
        } else {
          return res.status(201).json("Error");
        }
      })
      .catch(function (err) {
        if (err.code === 11000) {
          return res
            .status(201)
            .json("An action is already recorded on this client");
        }
      });
  } catch (error) {
    console.log(error);
  }
};
const ValiderAction = async (req, res) => {
  try {
    const { id, last_statut, next_statut, commentaire } = req.body;
    const { nom } = req.user;
    ModelAction.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          statut: next_statut,
        },
        $push: {
          statuschangeBy: {
            last_statut,
            next_statut,
            name: nom,
            commentaire,
          },
        },
      },
      { new: true }
    )
      .then((result) => {
        if (result) {
          return res.status(200).json("Done");
        } else {
          return res.status(201).json("Action intouvable");
        }
      })
      .catch(function (err) {
        return res.status(201).json("" + err);
      });
  } catch (error) {
    console.log(error);
  }
};
const Validation = async (req, res) => {
  try {
    let month = moment(new Date()).format("MM-YYYY");

    asyncLab.waterfall(
      [
        //Read role
        function (done) {
          ModelAction.aggregate([
            {
              $match: {
                month,
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
                as: "client",
              },
            },
            { $unwind: "$client" },
            {
              $lookup: {
                from: "tfeedbacks",
                localField: "client.currentFeedback",
                foreignField: "idFeedback",
                as: "tfeedback",
              },
            },
            { $unwind: "$tfeedback" },
            {
              $addFields: {
                nomclient: "$client.nomclient",
                par: "$client.par",
                currentstatus: "$tfeedback.title",
                delai: "$tfeedback.delai",
                id: "$_id",
              },
            },
            {
              $project: {
                nomclient: 1,
                par: 1,
                id: 1,
                currentstatus: 1,
                codeclient: 1,
                codeAgent: 1,
                shop: 1,
                region: 1,
                statut: 1,
                action: 1,
              },
            },
          ])
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
        return res.status(200).json(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const GraphiqueAction = async (req, res) => {
  try {
    let month = moment(new Date()).format("MM-YYYY");
    const { filtre } = req.params;
    asyncLab.waterfall(
      [
        function (done) {
          ModelAction.aggregate([
            { $match: { statut: "Approved", month } },
            {
              $group: {
                _id: {
                  title: filtre,
                  statut: "$action",
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
const ChangeActionByFile = async (req, res) => {
  try {
    const { data } = req.body;
    const { nom } = req.user;
    for (let i = 0; i < data.length; i++) {
      ModelAction.findOneAndUpdate(
        {
          _id: new ObjectId(data[i].id),
        },
        {
          $set: {
            statut: data[i].next_statut,
          },
          $push: {
            statuschangeBy: {
              last_statut: data[i].last_statut,
              next_statut: data[i].next_statut,
              name: nom,
              commentaire: data[i].commentaire,
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
  } catch (error) {}
};
const SubmitedByExcel = async (req, res) => {
  try {
    const { data } = req.body;
    const { nom, validationdt } = req.user;
    const month = moment(new Date()).format("MM-YYYY");

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
              month,
              shop: client.shop,
              region: client.region,
              savedBy: nom,
              plateforme: client.plateforme,
              codeAgent: client.codeAgent,
              action: client.action,
              statut: validationdt ? "Approved" : "Pending",
            },
            $push: {
              statuschangeBy: {
                last_statut: "No_Action",
                next_statut: validationdt ? "Approved" : client.statut,
                commentaire: client.commentaire,
                name: nom,
              },
            },
          },
          upsert: true,
          returnDocument: "after",
        },
      }));
      try {
        const result = await ModelAction.bulkWrite(bulkoperation);
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
  } catch (error) {
    return res.status(201).json("Error : " + error.message);
  }
};
module.exports = {
  AddAction,
  GraphiqueAction,
  SubmitedByExcel,
  ChangeActionByFile,
  AddOneAction,
  ValiderAction,
  Validation,
};
