const ModelAppel = require("../../Models/Portofolio/PFeedback");
const moment = require("moment");
const asyncLab = require("async");
const _ = require("lodash");
const ModelActionAgent = require("../../Models/Portofolio/ActionAgent");

const ActionAppel = async (req, res) => {
  try {
    const month = moment(new Date()).format("MM-YYYY");
    const { nom, fonction } = req.user;
    let match = fonction === "superUser" ? { month } : { month, agent: nom };

    asyncLab.waterfall(
      [
        function (done) {
          ModelAppel.aggregate([
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
                          { $eq: ["$type", "Reachable"] },
                          { $eq: ["$month", "$$month"] },
                        ],
                      },
                    },
                  },
                ],
                as: "appel",
              },
            },
            {
              $lookup: {
                from: "reactivations",
                let: { codeclient: "$codeclient", month },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$account_id", "$$codeclient"] },
                          { $eq: ["$month", "$$month"] },
                        ],
                      },
                    },
                  },
                ],
                as: "reactivation",
              },
            },
          ])
            .then((result) => {
              done(null, result);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        function (result, done) {
          ModelActionAgent.find(match)
            .lean()
            .then((agents) => {
              done(null, result, agents);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        function (result, agents_amount, done) {
          let agents = Object.keys(_.groupBy(result, "agent"));
          let analyse = agents.map((agent, key) => {
            return {
              agent,
              id: key,
              cash:
                _.filter(agents_amount, { codeAgent: agent })[0]?.amount || 0,
              nbre_appel: _.filter(result, { agent }).length,
              non_action: result.filter(
                (x) => x.agent === agent && x.reactivation.length === 0
              ).length,
              action: result.filter(
                (x) => x.agent === agent && x.reactivation.length > 0
              ).length,
              pourcentage: (
                (result.filter(
                  (x) => x.agent === agent && x.reactivation.length > 0
                ).length *
                  100) /
                _.filter(result, { agent }).length
              ).toFixed(0),
            };
          });

          analyse.push({
            agent: "Total",
            id: analyse.length + 1,
            cash: _.reduce(
              agents_amount,
              function (curr, next) {
                return next.amount + curr;
              },
              0
            ),
            nbre_appel: result.length,
            non_action: result.filter((x) => x.reactivation.length === 0)
              .length,
            action: result.filter((x) => x.reactivation.length > 0).length,
            pourcentage: (
              (result.filter((x) => x.reactivation.length > 0).length * 100) /
              result.length
            ).toFixed(0),
          });
          done(analyse);
        },
      ],
      function (analyse) {
        if (analyse.length > 0) {
          return res.status(200).json({ analyse });
        } else {
          return res.status(201).json("No operation found");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const SeachAmount = async (req, res) => {
  try {
    const response = await ModelActionAgent.find({}).lean();
    const month = Object.keys(_.groupBy(response, "month"));
    let byMonth = month.map((mois) => {
      return {
        name: mois,
        value: _.reduce(
          _.filter(response, { month: mois }),
          function (curr, next) {
            return next.amount + curr;
          },
          0
        ),
      };
    });
    return res.status(200).json(
      byMonth.sort(function (curr, next) {
        return next.name - curr;
      })
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = { ActionAppel, SeachAmount };
