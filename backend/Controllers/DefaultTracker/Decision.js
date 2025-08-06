const ModelDecision = require("../../Models/DefaultTracker/Decision");
const ModelClient = require("../../Models/DefaultTracker/TableClient");
const { ObjectId } = require("mongodb");
const asyncLab = require("async");
const moment = require("moment");
const _ = require("lodash");

const VerificationDecision = async (req, res) => {
  try {
    const { id, commentaire, next_statut } = req.body;
    const { nom } = req.user;
    if (next_statut === "REJECTED" && commentaire === "") {
      return res
        .status(201)
        .json("Commentary is mandatory for rejected decisions");
    }
    if (!next_statut || !id) {
      return res.status(201).json("ERROR");
    }
    asyncLab.waterfall(
      [
        function (done) {
          ModelDecision.findOneAndUpdate(
            {
              _id: new ObjectId(id),
            },
            {
              $set: {
                statut: next_statut,
                verifiedby: nom,
              },
              $push: {
                commentaire: {
                  commentaire,
                  sendby: req.user.nom,
                },
              },
            },
            { new: true }
          )
            .then((result) => {
              if (result) {
                done(null, result);
              } else {
                return res.status(201).json("Error");
              }
            })
            .catch(function (error) {
              return res.status(201).json(JSON.stringify(error));
            });
        },
        function (decision, done) {
          if (decision.statut === "APPROVED") {
            ModelClient.findOneAndUpdate(
              {
                codeclient: decision.codeclient,
                actif: true,
                month: decision.month,
              },
              { $set: { actif: false, statut_decision: decision.decision } }
            )
              .then((result) => {
                if (result) {
                  done(decision);
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          } else {
            done(decision);
          }
        },
      ],
      function (decision) {
        return res.status(200).json(decision);
      }
    );
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
          comment: 1,
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
//Change decision by form or excel file
const ChangeDecision = async (req, res) => {
  try {
    const { codeclient, comment, shop, idHistorique, region, decision } =
      req.body.data;

    const { nom, validationdt, role } = req.user;
    const month = moment().format("MM-YYYY");

    ModelDecision.create({
      codeclient,
      commentaire: {
        commentaire: comment,
        sendby: req.user.nom,
      },
      shop,
      id: idHistorique ? idHistorique : "",
      region,
      decision,
      idDepartement: role,
      month,
      createdBy: nom,
    })
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(201).json("Error");
        }
      })
      .catch(function (error) {
        console.log(error);
        return res.status(201).json(error.message);
      });
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
const GraphiqueDecision = async (req, res) => {
  try {
    let month = moment(new Date()).format("MM-YYYY");
    const { filtre } = req.params;
    asyncLab.waterfall(
      [
        function (done) {
          ModelDecision.aggregate([
            { $match: { statut: "APPROVED", month } },
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

const ReadDecisionArbitrage = async (req, res) => {
  try {
    const { departement } = req.params;
    let match =
      departement === "portfolio"
        ? { statut: "VERIFICATION" }
        : {
            idDepartement: departement,
            statut: { $in: ["PENDING", "REJECTED", "APPROVED"] },
          };
    ModelDecision.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          decision: 1,
          createdBy: 1,
          customer_id: "$codeclient",
          region: 1,
          id: 1,
          _id: 1,
          shop: 1,
          commentaire: 1,
          statut: 1,
          createdAt: 1,
        },
      },
    ]).then((result) => {
      return res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
  }
};
const ValidateDecision = async (req, res) => {
  try {
    const { id, statut, commentaire } = req.body;
    if (!id || !statut) {
      return res.status(201).json("Veuillez renseigner les champs");
    }
    if (statut === "REJECTED" && commentaire === "") {
      return res.status(201).json("Veuillez renseigner le commentaire");
    }
    asyncLab.waterfall(
      [
        function (done) {
          ModelDecision.findByIdAndUpdate(id, {
            $set: {
              statut,
              commentaire: {
                commentaire,
                sendby: req.user.nom,
              },
              verifiedby: req.user.nom,
            },
          }).then((result) => {
            if (statut === "APPROVED") {
              done(null, result);
            } else {
              return res.status(200).json(result);
            }
          });
        },
        function (decision, done) {
          ModelClient.findOneAndUpdate(
            {
              codeclient: decision.codeclient,
              actif: true,
              month: decision.month,
            },
            { $set: { actif: false, statut_decision: decision.decision } }
          )
            .then((result) => {
              done(result);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
      ],
      function (result) {
        if (result) {
          return res.status(200).json(result);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  GraphiqueDecision,
  VerificationDecision,
  ReadDecision,
  ChangeDecision,
  //Nouvelle version
  ValidateDecision,
  ReadDecisionArbitrage,
};
