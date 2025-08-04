const ModelFormat = require("../../Models/Communication/Format");

const AddFormat = (req, res) => {
  try {
    const { title, data } = req.body;
    if (!title || !data) {
      return res.status(201).json("Error");
    }
    ModelFormat.create({
      idFormat: new Date(),
      title,
      data,
    }).then((result) => {
      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
const ReadFormat = async (req, res) => {
  try {
    const response = await ModelFormat.find(
      {},
      { data: 1, title: 1, idFormat: 1 }
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
module.exports = { AddFormat, ReadFormat };
