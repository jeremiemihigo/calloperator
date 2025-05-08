const modelPayement = require("../../Models/Portofolio/Payement");
const moment = require("moment");
const _ = require("lodash");
const asyncLab = require("async");
const ActionAgent = require("../../Models/Portofolio/ActionAgent");
const ModelReactivation = require("../../Models/Portofolio/Reactivations");

const par = [
  { id: "PAR 0", value: 14.5 },
  { id: "NORMAL", value: 14.5 },
  { id: "PAR 15", value: 14.5 },
  { id: "PAR 30", value: 14.5 },
  { id: "PAR 60", value: 27.5 },
  { id: "PAR 90", value: 27.5 },
  { id: "PAR 120", value: 27.5 },
];

const AddPayement = async (req, res) => {
  try {
    const month = moment(new Date()).format("MM-YYYY");
    const { data } = req.body;
    let mapMonth = data.map(function (x, key) {
      return {
        ...x,
        month,
        id: new Date().getTime() + key + 1,
      };
    });
    const response = await modelPayement.insertMany(mapMonth);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
const ReadDataPayement = async (req, res) => {
  try {
    const month = moment(new Date()).format("MM-YYYY");
    asyncLab.waterfall(
      [
        function (done) {
          modelPayement
            .aggregate([
              { $match: { month, considerer: false } },
              {
                $group: {
                  _id: "$account_id",
                  total: { $sum: "$amount" },
                  ids: { $push: "$id" },
                },
              },
              {
                $lookup: {
                  from: "pdatabases",
                  let: { codeclient: "$_id" },
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
                  as: "info_client",
                },
              },
              {
                $lookup: {
                  from: "pfeedback_calls",
                  let: { codeclient: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$codeclient", "$$codeclient"] },
                            { $eq: ["$month", month] },
                            { $eq: ["$type", "Reachable"] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "calls",
                },
              },
            ])
            .then((result) => {
              done(
                null,
                result.filter(
                  (x) => x.info_client.length > 0 && x.calls.length > 0
                )
              );
            })
            .catch(function (error) {
              return res.status(201).json(error);
            });
        },
        function (clients, done) {
          const returnValuePar = (key) => {
            return par.filter((x) => x.id === key)[0].value;
          };
          var table = [];
          const returnActivation = (customer) => {
            return (
              customer.total / customer.info_client[0].dailyrate >=
              returnValuePar(customer.info_client[0].par)
            );
          };

          for (let i = 0; i < clients.length; i++) {
            table.push({
              account_id: clients[i]._id,
              codeAgent: clients[i].calls[0].agent,
              amount: clients[i].total,
              shop_name: clients[i].calls[0].shop,
              par: clients[i].info_client[0].par,
              dailyrate: clients[i].info_client[0].dailyrate,
              days: Math.trunc(
                clients[i].total / clients[i].info_client[0].dailyrate
              ),
              activation: returnActivation(clients[i]),
            });
          }
          done(table);
        },
      ],
      function (table) {
        return res.status(200).json(table);
      }
    );
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
const AcceptDataPayement = async (req, res) => {
  try {
    const month = moment(new Date()).format("MM-YYYY");
    const { data } = req.body;
    const { nom } = req.user;
    let datamany = _.filter(data, { activation: true }).map(function (i) {
      return {
        ...i,
        month,
        savedBy: nom,
        dateSave: new Date(moment(new Date()).format("YYYY-MM-DD")).getTime(),
      };
    });
    asyncLab.waterfall(
      [
        function (done) {
          ModelReactivation.insertMany(datamany)
            .then((result) => {
              done(null, result);
            })
            .catch(function (error) {
              return res.status(201).json(error.message);
            });
        },
        function (reactivation, done) {
          let lesIDs = datamany.map(function (x) {
            return x.account_id;
          });
          modelPayement
            .updateMany(
              { account_id: { $in: lesIDs } },
              { $set: { considerer: true } }
            )
            .then((result) => {
              done(result);
            })
            .catch(function (error) {
              return res.status(201).json(error.message);
            });
        },
      ],
      function (reactivation) {
        let agents = Object.keys(_.groupBy(datamany, "codeAgent")).map(
          function (react) {
            return {
              codeAgent: react,
              month,
              amount: _.reduce(
                _.filter(datamany, { codeAgent: react }),
                function (curr, next) {
                  return next.amount + curr;
                },
                0
              ),
            };
          }
        );
        async function updateClientsWithBulk() {
          const bulkOperations = agents.map((client) => ({
            updateOne: {
              filter: {
                codeAgent: client.codeAgent,
                month,
              },
              update: {
                $inc: { amount: client.amount },
                $set: { codeAgent: client.codeAgent, month: client.month },
              },
              upsert: true,
            },
          }));
          try {
            const result = await ActionAgent.bulkWrite(bulkOperations);
            return res
              .status(200)
              .json(`${result.modifiedCount} customer updated`);
          } catch (err) {
            return res
              .status(201)
              .json("Error during updates : " + err.message);
          }
        }
        updateClientsWithBulk();
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const ReadPayment = async (req, res) => {
  try {
    const month = moment(new Date()).format("MM-YYYY");
    const response = await modelPayement.find({ month, considerer: false });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await modelPayement.findOneAndDelete({
      id,
      considerer: false,
    });
    if (response) {
      return res.status(200).json(response);
    } else {
      return res
        .status(201)
        .json("Vous pouvez supprimer seulement le payement en pending");
    }
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
module.exports = {
  AddPayement,
  deletePayment,
  AcceptDataPayement,
  ReadPayment,
  ReadDataPayement,
};
