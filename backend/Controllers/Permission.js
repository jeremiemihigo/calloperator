const modelAgent = require("../Models/AgentAdmin");

const set_Plainte_Shop = async (req, res) => {
  try {
    const { idAgent, shop } = req.body;
    if (!idAgent || !shop) {
      return res.status(201).json("Veuillez renseigner les champs");
    }
    modelAgent
      .findByIdAndUpdate(
        idAgent,
        {
          $set: {
            plainte_callcenter: false,
          },
          $addToSet: { plainteShop: shop },
        },
        { new: true }
      )
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(404).json("Error");
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
const set_ModelAgentAdmin = async (req, res) => {
  try {
    const { idAgent, data, unset } = req.body;
    modelAgent
      .findByIdAndUpdate(
        idAgent,
        {
          $set: data,
          $unset: unset,
        },
        { new: true }
      )
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(404).json("Error");
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (error) {}
};
const AjouterUnShop = async (req, res) => {
  try {
    const { idAgent, plainteShop } = req.body;
    modelAgent
      .findByIdAndUpdate(
        idAgent,
        {
          $addToSet: {
            plainteShop,
          },
          $set: {
            plainte_callcenter: false,
          },
        },
        { new: true }
      )
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(404).json("Error");
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (error) {}
};
module.exports = { set_Plainte_Shop, AjouterUnShop, set_ModelAgentAdmin };
