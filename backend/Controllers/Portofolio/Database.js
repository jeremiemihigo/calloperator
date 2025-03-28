const ModelDatabase = require("../../Models/Portofolio/PDataBase");
const asyncLab = require("async");
const ModelRapport = require("../../Models/Rapport");
const moment = require("moment");
const ModelIssue = require("../../Models/Issue/Appel_Issue");

const PDatabase = async (req, res) => {
  try {
    const { data } = req.body;
    async function updateClientsWithBulk() {
      const bulkOperations = data.map((client) => ({
        updateOne: {
          filter: {
            codeclient: client.codeclient,
            idProjet: client.idProjet,
          },
          update: {
            $set: client,
          },
          upsert: true,
        },
      }));
      try {
        const result = await ModelDatabase.bulkWrite(bulkOperations);
        return res
          .status(200)
          .json(
            `${result.upsertedCount} insertion and ${result.modifiedCount} customer updated`
          );
      } catch (err) {
        return res.status(201).json("Error during updates : " + err.message);
      }
    }
    updateClientsWithBulk();
  } catch (error) {
    return res.status(201).json("Error " + error.message);
  }
};
const ReadByFilter = async (req, res) => {
  try {
    const { filter, etat } = req.body;
    let now = new Date(moment(new Date()).format("YYYY-MM-DD")).getTime();

    let match =
      etat === "Remind"
        ? { ...filter, remindDate: { $lt: now, $gt: 0 } }
        : filter;
    ModelDatabase.find(match)
      .lean()
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (err) {
        return res.status(201).json(err);
      });
  } catch (error) {
    return res.status(201).json(error);
  }
};
const ReadCustomerToTrack = async (req, res) => {
  try {
    const { search } = req.body;
    let recherche = { ...search };
    const today = new Date().getTime();
    recherche.remindDate = { $lt: today };
    ModelDatabase.aggregate([
      { $match: recherche },
      {
        $lookup: {
          from: "pfeedback_calls",
          let: { codeclient: "$codeclient", idPojet: "$idProjet" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$codeclient", "$$codeclient"] },
                    { $eq: ["$idProjet", "$$idProjet"] },
                  ],
                },
              },
            },
          ],
          as: "feedback",
        },
      },
    ])
      .then((result) => {
        return res.status(201).json(result);
      })
      .catch(function (error) {
        return res.status(201).json(error.message);
      });
  } catch (error) {
    console.log(error);
  }
};
const ClientInformation = async (req, res) => {
  try {
    const { codeclient } = req.params;
    asyncLab.waterfall(
      [
        function (done) {
          ModelRapport.find(
            { codeclient },
            {
              "demande.raison": 1,
              "demande.updatedAt": 1,
              "demandeur.codeAgent": 1,
            }
          )
            .sort({ "demande.updatedAt": -1 })
            .limit(1)
            .then((visite) => {
              done(null, visite);
            })
            .catch(function (err) {
              console.log(err);
            });
        },
        function (visite, done) {
          ModelIssue.find(
            { codeclient },
            { typePlainte: 1, statut: 1, dateSave: 1, plainteSelect: 1 }
          )
            .sort({ dateSave: -1 })
            .limit(1)
            .then((result) => {
              done(visite, result);
            })
            .catch(function (err) {
              console.log(err);
            });
        },
      ],
      function (visite, plainte) {
        return res.status(200).json({ visite, plainte });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  PDatabase,
  ReadByFilter,
  ClientInformation,
  ReadCustomerToTrack,
};
