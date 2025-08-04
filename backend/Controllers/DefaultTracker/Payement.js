const ModelPayement = require("../../Models/DefaultTracker/Payement");
const moment = require("moment");

const AddPayement = (req, res) => {
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
        return res.status(200).json("Opération effectuée avec succès");
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
const DeletePayment = (req, res) => {
  try {
    const id = req.body.id;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { AddPayement, ReadPayment };
