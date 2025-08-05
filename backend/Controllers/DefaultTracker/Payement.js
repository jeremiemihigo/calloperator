const ModelPayement = require("../../Models/DefaultTracker/Payement");
const moment = require("moment");
const asyncLab = require("async");
const ModelClient = require("../../Models/DefaultTracker/TableClient");

const AddPayement = (req, res, next) => {
  try {
    const { data } = req.body;
    if (!data || (data && data.length === 0)) {
      return res.status(201).json("Le fichier est vide");
    }
    const month = moment().format("MM-YYYY");
    const dateSave = new Date(moment().format("YYYY-MM-DD")).getTime();
    let donner = data.map((x) => {
      return {
        ...x,
        month,
        savedBy: req.user.nom,
        dateSave,
      };
    });
    ModelPayement.insertMany(donner)
      .then((result) => {
        req.message = "Opération effectuée avec succès";
        next();
      })
      .catch(function (error) {
        return res.status(201).json(error.message);
      });
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
const ReadPayment = (req, res) => {
  try {
    const month = moment().format("MM-YYYY");
    ModelPayement.aggregate([
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
                    { $eq: ["$month", month] },
                    { $eq: ["$codeclient", "$$codeclient"] },
                  ],
                },
              },
            },
          ],
          as: "tclient",
        },
      },
    ])
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};
const AjustagePayement = (req, res) => {
  try {
    const month = moment().format("MM-YYYY");
    const message = req.message;
    asyncLab.waterfall([
      function (done) {
        ModelPayement.aggregate([
          { $match: { month } },
          {
            $group: {
              _id: "$account_id",
              total: { $sum: "$amount" },
            },
          },
        ])
          .then((result) => {
            if (result.length > 0) {
              done(null, result);
            } else {
              return res.status(200).json(message);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      function (result, done) {
        async function updateClientsWithBulk() {
          const bulkoperation = result.map((client) => ({
            updateOne: {
              filter: {
                codeclient: client._id,
                month,
              },
              update: {
                $set: {
                  cashPayer: client.total,
                },
              },
              returnDocument: "after",
            },
          }));
          try {
            const reponse = await ModelClient.bulkWrite(bulkoperation);
            if (reponse) {
              done(null, true);
            }
          } catch (error) {
            console.log(error);
          }
        }
        updateClientsWithBulk();
      },
      function (result, done) {
        ModelClient.updateMany(
          { month, $expr: { $gte: ["$cashPayer", "$cashattendu"] } },
          { $set: { action: "REACTIVATION", actif: false } }
        )
          .then((clients) => {
            return res.status(200).json(message);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { AddPayement, AjustagePayement, ReadPayment };
