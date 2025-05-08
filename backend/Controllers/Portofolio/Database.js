const ModelDatabase = require("../../Models/Portofolio/PDataBase");
const moment = require("moment");
const asyncLab = require("async");

const PDatabase = async (req, res) => {
  try {
    const { data } = req.body;
    const month = moment(new Date()).format("MM-YYYY");
    async function updateClientsWithBulk() {
      const bulkOperations = data.map((client) => ({
        updateOne: {
          filter: {
            codeclient: client.codeclient,
            month,
          },
          update: {
            $set: { ...client, month },
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
    const month = moment(new Date()).format("MM-YYYY");

    let match =
      etat === "Remind"
        ? { ...filter, remindDate: { $lt: now, $gt: 0 }, month }
        : { ...filter, month };
    ModelDatabase.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "pfeedback_calls",
          let: { codeclient: "$codeclient", month },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$codeclient", "$$codeclient"] },
                    { $eq: ["$month", "$$month"] },
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
    const month = moment(new Date()).format("MM-YYYY");
    ModelDatabase.aggregate([
      { $match: recherche },
      {
        $lookup: {
          from: "pfeedback_calls",
          let: { codeclient: "$codeclient", month },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$codeclient", "$$codeclient"] },
                    { $eq: ["$month", "$$month"] },
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
const ClientStat = async (req, res) => {
  try {
    const month = moment(new Date()).format("MM-YYYY");
    const now = new Date(moment(new Date()).format("YYYY-MM-DD")).getTime();
    asyncLab.waterfall(
      [
        function (done) {
          ModelDatabase.find({ month }, { remindDate: 1, etat: 1, shop: 1 })
            .lean()
            .then((result) => {
              done(null, result);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        function (result, done) {
          const table = {};
          table.remind = result.filter(
            (x) => x.remindDate < now && x.remindDate > 0
          ).length;
          table.reachable = result.filter((x) => x.etat === "Reachable").length;
          table.unreachable = result.filter(
            (x) => x.etat === "Unreachable"
          ).length;
          table.pending = result.filter((x) => x.etat === "Pending").length;

          done(table);
        },
      ],
      function (result) {
        return res.status(200).json(result);
      }
    );
  } catch (error) {}
};
const dataupload = async (req, res) => {
  try {
    const month = moment(new Date()).format("MM-YYYY");
    const response = await ModelDatabase.find(
      { month },
      {
        id: "$_id",
        codeclient: 1,
        region: 1,
        shop: 1,
        customer_name: 1,
        par: 1,
        status: 1,
        etat: 1,
        dailyrate: 1,
        weeklyrate: 1,
        monthlyrate: 1,
        month: 1,
        first_number: 1,
        second_number: 1,
        payment_number: 1,
      }
    ).lean();
    return res.status(200).json(response);
  } catch (error) {}
};
const deleteupload = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await ModelDatabase.findByIdAndDelete(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

const editoneupload = async (req, res) => {
  try {
    const { data, id } = req.body;
    const response = await ModelDatabase.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
module.exports = {
  PDatabase,
  editoneupload,
  ReadByFilter,
  ReadCustomerToTrack,
  deleteupload,
  ClientStat,
  dataupload,
};
