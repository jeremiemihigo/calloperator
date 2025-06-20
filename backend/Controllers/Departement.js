const ModelRole = require("../Models/DefaultTracker/Role");
const ModelPoste = require("../Models/Poste");
const asyncLab = require("async");

const addposte = async (req, res) => {
  try {
    const { title, idDepartement, filterby } = req.body;
    if (!title || !idDepartement || !filterby) {
      return res.status(201).json("Veuillez renseigner les champs");
    }
    const response = await ModelPoste.create({
      title,
      idDepartement,
      filterby,
      id: new Date().getTime(),
    });
    if (response) {
      return res.status(200).json("Done");
    } else {
      return res.status(201).json("Error");
    }
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
const DeleteDepartement = async (req, res) => {
  try {
    const { id } = req.body;
    asyncLab.waterfall([
      function (done) {
        ModelPoste.find({ idDepartement: id }).then((result) => {
          if (result.length > 0) {
            return res
              .status(201)
              .json("Y a un poste enregistré dans ce departement");
          } else {
            done(null, true);
          }
        });
      },
      function (r, done) {
        ModelRole.findOneAndDelete({ idRole: id }).then((result) => {
          return res.status(200).json(id);
        });
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};
const ReadPoste = async (req, res) => {
  try {
    const response = await ModelPoste.find({});
    if (response.length > 0) {
      return res.status(200).json(response);
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addposte,
  ReadPoste,
  DeleteDepartement,
};
