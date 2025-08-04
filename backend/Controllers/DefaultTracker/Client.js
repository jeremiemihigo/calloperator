const ModelClient = require("../../Models/DefaultTracker/TableClient");
const asyncLab = require("async");
const { ObjectId } = require("mongodb");
const moment = require("moment");
const ModelPoste = require("../../Models/Poste");
const ModelFeedback = require("../../Models/Feedback");
const { initialeSearch } = require("../../Static/Static_Function");
const ModelRapport = require("../../Models/Rapport");

let searchData = [
  {
    $lookup: {
      from: "tfeedbacks",
      localField: "currentFeedback",
      foreignField: "idFeedback",
      as: "tfeedback",
    },
  },

  { $unwind: "$tfeedback" },
];
let searchData2 = [
  {
    $lookup: {
      from: "rapports",
      localField: "codeclient",
      foreignField: "codeclient",
      as: "visites",
    },
  },
  {
    $lookup: {
      from: "rapports",
      localField: "visite",
      foreignField: "idDemande",
      as: "visite_concerne",
    },
  },
  {
    $lookup: {
      from: "pfeedback_calls",
      let: { codeclient: "$codeclient" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$codeclient", "$$codeclient"] },
                { $eq: ["$type", "Reachable"] },
              ],
            },
          },
        },
      ],
      as: "appelles",
    },
  },
  {
    $addFields: {
      derniereappel: {
        $arrayElemAt: [
          {
            $reverseArray: "$appelles", // Renverse l'ordre du tableau
          },
          0,
        ],
      },
    },
  },
  {
    $lookup: {
      from: "roles",
      localField: "tfeedback.idRole",
      foreignField: "idRole",
      as: "incharge",
    },
  },
  {
    $lookup: {
      from: "postes",
      localField: "tfeedback.idRole",
      foreignField: "id",
      as: "postes",
    },
  },
  {
    $project: {
      codeclient: 1,
      postes: 1,
      nomclient: 1,
      decision: 1,
      month: 1,
      id: 1,
      shop: 1,
      region: 1,
      action: 1,
      visite_concerne: 1,
      par: 1,
      currentFeedback: 1,
      submitedBy: 1,
      tfeedback: 1,
      visites: 1,
      derniereappel: 1,
      appel: 1,
      fullDate: 1,
      statut_decision: 1,
      incharge: 1,
      statut: 1,
      feedback: 1,
    },
  },
];
const AddClientDT = async (req, res) => {
  try {
    const { data } = req.body;
    const { nom } = req.user;
    let month = moment(new Date()).format("MM-YYYY");
    const client = data.map((x) => {
      return {
        ...x,
        month,
        codeclient: x.customer_id,
        nomclient: x.customer_name,
        submitedBy: nom,
        dateupdate: new Date(),
      };
    });
    if (client.length <= 0) {
      return res.status(201).json("Aucun client renseigné");
    }
    asyncLab.waterfall(
      [
        function (done) {
          ModelClient.insertMany(client)
            .then((response) => {
              done(response);
            })
            .catch(function (err) {
              return res.status(201).json("Error " + err);
            });
        },
      ],
      function (response) {
        if (response) {
          return res.status(200).json("Opération effectuée");
        } else {
          return res.status(201).json("Erreur");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const ReadFilterClient = async (req, res) => {
  try {
    const { valuefilter, poste, fonction } = req.user;
    const { validation, po, visites } = req.validation;
    asyncLab.waterfall(
      [
        //Read role
        function (done) {
          ModelPoste.aggregate([
            { $match: { id: poste } },
            {
              $lookup: {
                from: "roles",
                localField: "idDepartement",
                foreignField: "idRole",
                as: "departement",
              },
            },
            { $unwind: "$departement" },
          ]).then((result) => {
            if (result.length > 0) {
              done(null, result[0]);
            } else {
              return res
                .status(201)
                .json("No position found; you can contact the administrator");
            }
          });
        },
        function (department, done) {
          let aggregation =
            fonction === "superUser"
              ? [{ $match: { suivisuperuser: true } }]
              : [
                  { $unwind: "$idRole" },
                  {
                    $match: {
                      $or: [
                        { idRole: poste },
                        {
                          idRole: department.departement.idRole,
                          typecharge: "departement",
                        },
                      ],
                    },
                  },
                ];
          ModelFeedback.aggregate([
            ...aggregation,
            { $project: { idFeedback: 1 } },
          ]).then((result) => {
            if (result.length > 0) {
              let table = result.map((x) => x.idFeedback);
              done(null, department, table);
            } else {
              done(null, department, result);
            }
          });
        },
        function (result_poste, feedbacks, done) {
          let parsuperieur = ["PAR 120", "PAR 90", "PAR 60"];
          let parinferieur = ["PAR 15", "PAR 30"];
          let month = moment(new Date()).format("MM-YYYY");
          let filtre = {};
          filtre.month = month;
          filtre.feedback = { $in: ["APPROVED", "SUCCESS"] };
          filtre.action = { $in: ["NO_ACTION", "REJECTED"] };
          filtre.statut_decision = "TRACKING_ONGOING";

          filtre.actif = true;
          if (fonction === "superUser") {
            filtre.currentFeedback = { $in: feedbacks };
          }
          if (fonction !== "superUser" && result_poste.filterby === "region") {
            filtre.region = { $in: valuefilter };
            filtre.currentFeedback = { $in: feedbacks };
          }
          if (fonction !== "superUser" && result_poste.filterby === "shop") {
            //RS
            if (poste === "1750079733475") {
              filtre.par = { $in: parinferieur };
            }
            //Shop manager
            if (poste === "1750079748336") {
              filtre.par = { $in: parsuperieur };
            }
            filtre.shop = { $in: valuefilter };
            filtre.currentFeedback = { $in: feedbacks };
          }

          done(null, filtre);
        },
        function (filtre, done) {
          let surch =
            fonction === "superUser"
              ? {
                  $match: { "postes.idDepartement": "NRMRG" },
                }
              : { $match: {} };

          ModelClient.aggregate([{ $match: filtre }, ...initialeSearch, surch])
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
        return res.status(200).json({
          client: result,
          validation,
          po,
          dateServer: new Date(),
          visites,
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const ReadAllClient = async (req, res) => {
  try {
    let month = moment().format("MM-YYYY");
    asyncLab.waterfall(
      [
        function (done) {
          ModelClient.aggregate([{ $match: { month } }, ...initialeSearch])
            .then((result) => {
              done(null, result);
            })
            .catch(function (err) {
              return res.status(404).json(err);
            });
        },
        function (result, done) {
          ModelFeedback.find({})
            .lean()
            .then((feedbacks) => {
              done(result, feedbacks);
            });
        },
      ],
      function (resultat, feedbacks) {
        return res.status(200).json({ resultat, feedbacks });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const ReadCertainClient = async (req, res) => {
  try {
    const { data } = req.body;
    let month = moment(new Date()).format("MM-YYYY");
    ModelClient.aggregate([
      { $match: { codeclient: { $in: data }, month } },
      {
        $lookup: {
          from: "tfeedbacks",
          localField: "currentFeedback",
          foreignField: "idFeedback",
          as: "tfeedback",
        },
      },
      {
        $lookup: {
          from: "rapports",
          localField: "codeclient",
          foreignField: "codeclient",
          as: "visites",
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
const ChangeStatusOnly = async (req, res) => {
  try {
    const { id, data } = req.body;
    if (!id || !data) {
      return res.status(201).json("Veuillez renseigner les champs");
    }

    ModelClient.findByIdAndUpdate(id, { $set: data }, { new: true })
      .then((result) => {
        done(null, result);
      })
      .catch(function (error) {
        return res.status(201).json(error.message);
      });
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
const ReadCustomerStatus = async (req, res) => {
  try {
    const { status } = req.params;
    asyncLab.waterfall(
      [
        function (done) {
          let month = moment(new Date()).format("MM-YYYY");
          let filtre = {};
          filtre.currentFeedback = status;
          filtre.month = month;
          filtre.actif = true;
          done(null, filtre);
        },
        function (filtre, done) {
          ModelClient.aggregate([
            ...searchData,
            { $match: filtre },
            ...searchData2,
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
const InformationClient = (req, res) => {
  try {
    const { codeclient } = req.body;
    if (!codeclient) {
      return res.status(201).json("Error");
    }
    ModelClient.aggregate([
      { $match: { codeclient: codeclient.trim() } },
      {
        $lookup: {
          from: "rapports",
          let: { month: "$month", codeclient: "$codeclient" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$demande.lot", "$$month"] },
                    { $eq: ["$codeclient", "$$codeclient"] },
                  ],
                },
              },
            },
          ],
          as: "visites",
        },
      },
      {
        $project: {
          visites: 1,
          nomclient: 1,
          codeclient: 1,
          month: 1,
          shop: 1,
          region: 1,
          par: 1,
          currentFeedback: 1,
          historique: 1,
          action: 1,
          statut_decision: 1,
        },
      },
    ]).then((result) => {
      return res.status(200).json(result.reverse());
    });
  } catch (error) {
    console.log(error);
  }
};
const ShowAction = (req, res) => {
  try {
    const month = moment().format("MM-YYYY");
    asyncLab.waterfall(
      [
        //recherche des feedbacks considérés comme action
        function (done) {
          ModelFeedback.find({ isAction: true })
            .then((result) => {
              if (result.length > 0) {
                let feedback = result.map((index) => {
                  return index.idFeedback;
                });
                done(null, feedback);
              } else {
                return res
                  .status(201)
                  .json("Aucun feedback qui est considéré comme action");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        function (result, done) {
          ModelClient.aggregate([
            {
              $match: {
                actif: true,
                month,
                $or: [
                  { changeto: { $in: result } },
                  { currentFeedback: { $in: result } },
                ],
                // feedback: "PENDING",
              },
            },
            {
              $lookup: {
                from: "tfeedbacks",
                localField: "changeto",
                foreignField: "idFeedback",
                as: "changeto_feedback",
              },
            },
            { $unwind: "$changeto_feedback" },
            {
              $lookup: {
                from: "tfeedbacks",
                localField: "currentFeedback",
                foreignField: "idFeedback",
                as: "current",
              },
            },
            { $unwind: "$current" },
            {
              $project: {
                id: "$_id",
                changeto: 1,
                codeclient: 1,
                nomclient: 1,
                shop: 1,
                par: 1,
                region: 1,
                submitedBy: 1,
                changeto_feedback: "$changeto_feedback.title",
                current: "$current.title",
              },
            },
          ]).then((clients) => {
            done(clients);
          });
        },
      ],
      function (clients) {
        if (clients) {
          return res.status(200).json(clients);
        } else {
          return res.status(201).json("Error");
        }
      }
    );
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
const ValidationAction = (req, res) => {
  const { data } = req.body;
  const month = moment().format("MM-YYYY");
  async function updateClientsWithBulk() {
    const bulkoperation = data.map((client) => ({
      updateOne: {
        filter: {
          codeclient: client.codeclient,
          month,
          actif: true,
          // feedback: "PENDING",
        },
        update: {
          $set:
            client.statut === "APPROVED"
              ? {
                  actif: false,
                  feedback: "APPROVED",
                  currentFeedback: client.changeto,
                }
              : {
                  feedback: "APPROVED",
                  changeto: "",
                  submitedBy: req.user.nom,
                },
        },
        returnDocument: "after",
      },
    }));
    try {
      const result = await ModelClient.bulkWrite(bulkoperation);
      if (result) {
        return res.status(200).json("Operation completed successfully");
      }
    } catch (error) {
      console.log(error);
    }
  }
  updateClientsWithBulk();
};
const customerToRefresh = (req, res) => {
  try {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setMonth(today.getMonth() - 3);
    // Aller au 1er jour du mois suivant
    const nextMonth = new Date(
      pastDate.getFullYear(),
      pastDate.getMonth() + 1,
      1
    );
    // Soustraire 1 jour pour avoir le dernier jour du mois courant
    const lastDayOfMonth = new Date(nextMonth - 1);
    const aujourdhui = new Date(moment().format("YYYY-MM-DD"));
    const derriere3mois = new Date(moment(lastDayOfMonth).format("YYYY-MM-DD")); // Format YYYY-MM-DD

    asyncLab.waterfall([
      function (done) {
        ModelFeedback.find({ torefresh: true })
          .lean()
          .then((feedbacks) => {
            if (feedbacks.length > 0) {
              let feed = feedbacks.map((i) => {
                return i.idFeedback;
              });
              done(null, feed);
            } else {
              return res.status(201).json("No feedback found");
            }
          });
      },
      function (feedbacks, done) {
        ModelClient.aggregate([
          { $match: { currentFeedback: { $in: feedbacks } } },
          {
            $lookup: {
              from: "rapports",
              localField: "codeclient",
              foreignField: "codeclient",
              as: "visites",
            },
          },
          {
            $addFields: {
              dernierevisite: {
                $arrayElemAt: [
                  {
                    $reverseArray: "$visites", // Renverse l'ordre du tableau
                  },
                  0,
                ],
              },
            },
          },
          {
            $match: {
              "dernierevisite.dateSave": { $lte: derriere3mois },
            },
          },
          {
            $lookup: {
              from: "tfeedbacks",
              localField: "dernierevisite.demande.raison",
              foreignField: "idFeedback",
              as: "feedback",
            },
          },
          { $unwind: "$feedback" },
          {
            $lookup: {
              from: "pfeedback_calls",
              let: { codeclient: "$codeclient" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$codeclient", "$$codeclient"] },
                        { $eq: ["$type", "Reachable"] },
                      ],
                    },
                  },
                },
              ],
              as: "appelles",
            },
          },
          {
            $addFields: {
              derniereappel: {
                $arrayElemAt: [
                  {
                    $reverseArray: "$appelles", // Renverse l'ordre du tableau
                  },
                  0,
                ],
              },
            },
          },
          {
            $lookup: {
              from: "tfeedbacks",
              localField: "appelles.sioui_texte",
              foreignField: "idFeedback",
              as: "feedbackcall",
            },
          },
          { $unwind: "$feedbackcall" },

          {
            $project: {
              dernierevisite: 1,
              codeclient: "$dernierevisite.codeclient",
              nomclient: "$nomclient",
              shop: 1,
              par: 1,
              id: "$_id",
              _id: "$_id",
              dateSave: "$dernierevisite.dateSave",
              feedback: "$feedback.title",
              visitedby: "$dernierevisite.demandeur.nom",
              feedback_call: "$feedbackcall.title",
            },
          },
        ]).then((result) => {
          return res.status(200).json(result);
        });
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};

const verification_field = (req, res) => {
  try {
    const { valueFilter, poste, fonction } = req.user;
    const filterfonction = req.params.filterfonction
      ? req.params.filterfonction
      : "PO";
    const month = moment().format("MM-YYYY");
    const idDepartement = req.params.departement;
    asyncLab.waterfall(
      [
        function (done) {
          ModelPoste.find({ idDepartement }, { id: 1 })
            .lean()
            .then((postes) => {
              let tab = postes.map((x) => {
                return x.id;
              });
              tab.push(idDepartement);
              let monposte = postes.filter((x) => x.id === poste);
              done(null, tab, monposte);
            })
            .catch(function (error) {
              return res.status(201).json(error);
            });
        },
        function (postes, monposte, done) {
          ModelFeedback.find({ idRole: { $in: postes } })
            .lean()
            .then((result) => {
              let feedback = result.map((x) => {
                return x.idFeedback;
              });
              done(null, feedback, monposte);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        function (feedbacks, monposte, done) {
          let fiterby = monposte.length > 0 ? monposte[0].filterby : "";
          let match =
            fonction === "superUser"
              ? { actif: true, month, currentFeedback: { $in: feedbacks } }
              : {
                  [fiterby]: { $in: valueFilter },
                  actif: true,
                  month,
                  currentFeedback: { $in: feedbacks },
                };
          ModelClient.aggregate([
            {
              $match: match,
            },
            {
              $lookup: {
                from: "tfeedbacks",
                localField: "currentFeedback",
                foreignField: "idFeedback",
                as: "tfeedback",
              },
            },

            { $unwind: "$tfeedback" },
            {
              $lookup: {
                from: "rapports",
                localField: "visite",
                foreignField: "idDemande",
                as: "visite_concerne",
              },
            },
            {
              $lookup: {
                from: "rapports",
                let: { codeclient: "$codeclient" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$codeclient", "$$codeclient"] },
                          { $eq: ["$demandeur.fonction", filterfonction] },
                        ],
                      },
                    },
                  },
                ],
                as: "visite_fonction",
              },
            },

            {
              $lookup: {
                from: "pfeedback_calls",
                let: { codeclient: "$codeclient" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$codeclient", "$$codeclient"] },
                          { $eq: ["$type", "Reachable"] },
                        ],
                      },
                    },
                  },
                ],
                as: "appelles",
              },
            },
            {
              $addFields: {
                vm_fonction: {
                  $arrayElemAt: [
                    {
                      $reverseArray: "$visite_fonction", // Renverse l'ordre du tableau
                    },
                    0,
                  ],
                },
                last_call: {
                  $arrayElemAt: [
                    {
                      $reverseArray: "$appelles", // Renverse l'ordre du tableau
                    },
                    0,
                  ],
                },
                visite_categori: {
                  $arrayElemAt: [
                    {
                      $reverseArray: "$visite_concerne", // Renverse l'ordre du tableau
                    },
                    0,
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "roles",
                localField: "tfeedback.idRole",
                foreignField: "idRole",
                as: "departement",
              },
            },
            {
              $lookup: {
                from: "postes",
                localField: "tfeedback.idRole",
                foreignField: "id",
                as: "postes",
              },
            },
            {
              $project: {
                codeclient: 1,
                nomclient: 1,
                shop: 1,
                par: 1,
                vm_fonction: 1,
                last_call: 1,
                visite_categori: 1,
                currentFeedback: "$tfeedback.title",
                submitedBy: 1,
                departement: 1,
                postes: 1,
                region: 1,
              },
            },
          ]).then((result) => {
            done(result);
          });
        },
      ],
      function (result) {
        return res.status(200).json(result);
      }
    );
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
const cas_valider = (req, res) => {
  try {
    const month = moment().format("MM-YYYY");
    const { departement } = req.params;

    ModelClient.aggregate([
      {
        $match: {
          month,
          historique: { $not: { $size: 0 } },
        },
      },
      { $unwind: "$historique" },
      { $match: { "historique.departement": departement } },
      {
        $lookup: {
          from: "tfeedbacks",
          localField: "historique.nextfeedback",
          foreignField: "idFeedback",
          as: "nextfeedback",
        },
      },
      {
        $lookup: {
          from: "tfeedbacks",
          localField: "historique.lastfeedback",
          foreignField: "idFeedback",
          as: "lastfeedback",
        },
      },
      { $unwind: "$lastfeedback" },
      { $unwind: "$nextfeedback" },
      {
        $lookup: {
          from: "agentadmins",
          localField: "historique.submitedBy",
          foreignField: "codeAgent",
          as: "agent",
        },
      },
      { $unwind: "$agent" },
      {
        $lookup: {
          from: "decisions",
          localField: "historique._id",
          foreignField: "id",
          as: "decision",
        },
      },
      {
        $project: {
          customer_id: "$codeclient",
          customer_name: "$nomclient",
          shop: 1,
          par: 1,
          region: 1,
          lastfeedback: "$lastfeedback.title",
          nextfeedback: "$nextfeedback.title",
          submitedBy: "$agent.nom",
          sla: "$historique.sla",
          createdAt: "$historique.createdAt",
          idHistorique: "$historique._id",
          decision: 1,
        },
      },
    ]).then((result) => {
      return res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
  }
};
const AllVisitsStaff = (req, res) => {
  try {
    const { fonction, idvm } = req.user;
    const month = moment().format("MM-YYYY");
    const project = {
      agent_name: "$demandeur.nom",
      agent_fonction: "$demandeur.fonction",
      customer_id: "$codeclient",
      PayementStatut: 1,
      clientStatut: 1,
      demandeur: 1,
      customer_name: "$nomClient",
      consExpDays: 1,
      shop: "$shop.shop",
      region: "$region.denomination",
      dateSave: "$demande.updatedAt",
      raison: "$demande.raison",
      indt: 1,
    };
    const postevmstaff = ["ZBM", "PO", "RS", "SM", "TL"];
    const lastmatch =
      fonction === "superUser"
        ? {
            "demandeur.fonction": { $in: postevmstaff },
            "demande.lot": month,
          }
        : { "demande.lot": month, "demandeur.codeAgent": idvm };
    ModelRapport.aggregate([
      { $match: lastmatch },
      {
        $lookup: {
          from: "zones",
          localField: "idZone",
          foreignField: "idZone",
          as: "region",
        },
      },
      { $unwind: "$region" },
      {
        $lookup: {
          from: "shops",
          localField: "idShop",
          foreignField: "idShop",
          as: "shop",
        },
      },
      { $unwind: "$shop" },
      {
        $lookup: {
          from: "tclients",
          localField: "codeclient",
          foreignField: "codeclient",
          as: "indt",
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
          as: "indt",
        },
      },
      { $project: project },
    ]).then((visites) => {
      return res.status(200).json(visites);
    });
  } catch (error) {
    console.log(error);
  }
};
const ChangeStatus = async (req, res, next) => {
  try {
    console.log("je suis dedans");
    const { nom, validationdt, codeAgent, poste, role } = req.user;
    console.log(req.body);
    const { data } = req.body;
    //id, lastFeedback, nextFeedback
    if (!data) {
      return res.status(201).json("Veuillez renseigner les champs");
    }
    asyncLab.waterfall([
      function (done) {
        async function updateClientsWithBulk() {
          try {
            // 1. Attendre que tous les `findById` et calculs soient terminés

            const bulkOperations = await Promise.all(
              data.map(async (client) => {
                const lastclient = await ModelClient.findById(client.id);
                if (!lastclient) return null; // éviter une erreur si client non trouvé
                const now = new Date();
                const diffMs = now - lastclient.dateupdate;
                const diffHours = diffMs / (1000 * 60 * 60); // conversion en heures
                const sla = diffHours > 72 ? "OUT SLA" : "IN SLA";
                return {
                  updateOne: {
                    filter: {
                      _id: new ObjectId(client.id),
                      currentFeedback: lastclient.currentFeedback,
                    },
                    update: {
                      $set: {
                        currentFeedback: validationdt
                          ? client.nextFeedback
                          : lastclient.lastFeedback,
                        feedback: validationdt ? "APPROVED" : "PENDING",
                        dateupdate: now,
                        changeto: client.nextFeedback,
                        submitedBy: nom,
                      },
                      $push: {
                        historique: {
                          lastfeedback: client.lastFeedback,
                          nextfeedback: client.nextFeedback,
                          commentaire: client.commentaire,
                          submitedBy: codeAgent,
                          poste,
                          departement: role,
                          sla,
                        },
                      },
                    },
                  },
                };
              })
            );
            // 2. Supprimer les null (cas où client non trouvé)
            const filteredOps = bulkOperations.filter((op) => op !== null);

            if (filteredOps.length === 0) {
              return res.status(404).json("Aucune opération à exécuter.");
            }
            // 3. Exécuter les mises à jour
            const result = await ModelClient.bulkWrite(filteredOps);
            if (result) {
              return res.status(200).json(`operation completed successfully`);
            }
          } catch (err) {
            return res.status(201).json("Error during updates: " + err.message);
          }
        }

        updateClientsWithBulk();
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  AddClientDT,
  InformationClient,
  ReadCustomerStatus,
  ChangeStatus,
  ReadCertainClient,
  ChangeStatusOnly,
  ReadFilterClient,
  //Actions
  ShowAction,
  ValidationAction,
  customerToRefresh,

  //NOUVEAU PROJET
  ReadAllClient,
  verification_field,
  cas_valider,
  AllVisitsStaff,
};
