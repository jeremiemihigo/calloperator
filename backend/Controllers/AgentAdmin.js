const ModelAgentAdmin = require("../Models/AgentAdmin");
const asyncLab = require("async");

//Corbeille done
const AddAdminAgent = async (req, res) => {
  try {
    const { nom, codeAgent, poste, valuefilter, fonction, role } = req.body;
    //Agent admin qui fait l'operation
    if (!nom || !codeAgent || !fonction || !role || !poste) {
      return res.status(404).json("Veuillez renseigner les champs");
    }

    asyncLab.waterfall(
      [
        function (done) {
          ModelAgentAdmin.findOne({ codeAgent })
            .then((agent) => {
              if (agent) {
                return res.status(404).json("ce code existe deja");
              } else {
                done(null, agent);
              }
            })
            .catch(function (err) {
              console.log(err);
            });
        },
        function (agent, done) {
          ModelAgentAdmin.create({
            nom,
            password: "1234",
            fonction,
            codeAgent,
            role,
            valuefilter,
            poste,
            id: new Date(),
          })
            .then((result) => {
              if (result) {
                done(result);
              }
            })
            .catch(function (err) {
              if (err) {
                return res.status(404).json("Error " + err);
              }
            });
        },
      ],
      function (result) {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(404).json("Erreur d'enregistrement");
        }
      }
    );
  } catch (error) {
    return res.status(404).json("Error");
  }
};
//Corbeille done
const ReadAgentAdmin = async (req, res) => {
  try {
    const match = req.recherche ? { codeAgent: req.recherche } : {};
    ModelAgentAdmin.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "postes",
          localField: "poste",
          foreignField: "id",
          as: "poste",
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "idRole",
          as: "departement",
        },
      },
    ])

      .then((agents) => {
        if (agents.length > 0) {
          let data = req.recherche ? agents[0] : agents.reverse();
          return res.status(200).json(data);
        } else {
          return res.status(200).json([]);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
const BloquerAgentAdmin = async (req, res) => {
  try {
    const { id, value } = req.body;
    const { codeAgent } = req.user; //Agent admin qui fait l'operation
    if (!codeAgent || !id) {
      return res.status(201).json("Erreur");
    }
    asyncLab.waterfall(
      [
        function (done) {
          ModelAgentAdmin.findByIdAndUpdate(
            id,
            { $set: { active: value, first: true } },
            { new: true }
          )
            .then((response) => {
              if (response) {
                done(response);
              } else {
                return res.status(201).json("Erreur");
              }
            })
            .catch(function (err) {
              console.log(err);
            });
        },
      ],
      function (result) {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(200).json("Erreur");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const AddTache = async (req, res) => {
  try {
    const { codeAgent, tache } = req.body;
    ModelAgentAdmin.findOneAndUpdate(
      { codeAgent },
      { $addToSet: { taches: tache } },
      { new: true }
    )
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
const EditAgent = async (req, res) => {
  try {
    const { id, data } = req.body;
    if (!id || !data) {
      return res.status(404).json("Veuillez renseigner les champs");
    }
    ModelAgentAdmin.findByIdAndUpdate(id, { $set: data }, { new: true })
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(404).json("Error");
        }
      })
      .catch(function (err) {
        return res.status(404).json("Erro " + err);
      });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  AddAdminAgent,
  ReadAgentAdmin,
  BloquerAgentAdmin,
  AddTache,
  EditAgent,
};
