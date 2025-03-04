const ModelDatabase = require("../../Models/Portofolio/PDataBase");

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
        },
      }));
      try {
        const result = await ModelDatabase.bulkWrite(bulkOperations);
        return res
          .status(200)
          .json(`Mises à jour réussies : ${result.modifiedCount} clients`);
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
    const { filter } = req.body;
    ModelDatabase.find(filter)
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
module.exports = { PDatabase, ReadByFilter, ReadCustomerToTrack };
