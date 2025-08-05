const ModelRapport = require("../Models/Rapport");
const ModelDemande = require("../Models/Demande");
const ModelAppelPortofolio = require("../Models/Portofolio/PFeedback");
const asyncLab = require("async");
const moment = require("moment");

const { returnLastFirstDate } = require("../Static/Static_Function");

const AnalyseVisites = async (req, res) => {
  try {
    const { date } = req.body;
    const { lastDate, firstDate } = returnLastFirstDate(date);
    const currentDate = new Date(date);
    currentDate.setDate(1);
    const l = currentDate.toISOString().split("T")[0];
    const lastNowDate = new Date(l);
    const today = new Date(new Date(date).toISOString().split("T")[0]);

    asyncLab.waterfall(
      [
        function (done) {
          ModelRapport.aggregate([
            {
              $match: {
                "demandeur.fonction": { $in: ["agent", "tech"] },
              },
            },
            {
              $project: {
                formattedDate: {
                  $toDate: {
                    $concat: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$demande.updatedAt",
                        },
                      },
                      "T00:00:00Z",
                    ],
                  },
                },
                codeclient: 1,
                idZone: 1,
                idShop: 1,
                _id: 0,
                fonction: "$demandeur.fonction",
              },
            },
            {
              $match: {
                formattedDate: { $lte: lastDate, $gte: firstDate },
              },
            },
          ])
            .then((result) => {
              done(null, result);
            })
            .catch(function (err) {
              console.log(err);
            });
        },
        function (last_visite, done) {
          ModelRapport.aggregate([
            {
              $match: {
                "demandeur.fonction": { $in: ["agent", "tech"] },
              },
            },
            {
              $project: {
                formattedDate: {
                  $toDate: {
                    $concat: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$demande.updatedAt",
                        },
                      },
                      "T00:00:00Z",
                    ],
                  },
                },
                codeclient: 1,
                idZone: 1,
                idShop: 1,
                _id: 0,
                fonction: "$demandeur.fonction",
              },
            },
            {
              $match: {
                formattedDate: { $lte: today, $gte: lastNowDate },
              },
            },
          ])
            .then((result) => {
              done(last_visite, result);
            })
            .catch(function (err) {
              console.log(err);
            });
        },
      ],
      function (last_month, this_month) {
        return res
          .status(200)
          .json({ last_month, lastDate, today, this_month });
      }
    );
  } catch (error) {}
};

const BadgeSidebar = async (req, res) => {
  try {
    const { validateShop } = req.user;
    const month = moment().format("MM-YYYY");

    const today = new Date(moment().format("YYYY-MM-DD")); // inutile ici sauf si tu l'utilises ailleurs
    const appro = await ModelDemande.countDocuments({
      concerne: "rs",
      valide: false,
      idShop: { $in: validateShop },
      feedback: "chat",
      lot: month,
    });
    const portofolio = await ModelAppelPortofolio.countDocuments({
      dateSave: today.getTime(),
      type: "Reachable",
    });

    // Retour JSON
    return res.json({ appro, portofolio });
  } catch (err) {
    console.error("Erreur dans BadgeSidebar:", err);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

module.exports = {
  AnalyseVisites,
  BadgeSidebar,
};
