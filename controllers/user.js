const Client = require("../models/Client");
const Expert = require("../models/Expert");
const Company = require("../models/Company");

const userControl = async (role, id) => {
  try {
    const model =
      role === "company"
        ? Company
        : role === "expert"
        ? Expert
        : role === "client"
        ? Client
        : undefined;

    let objectModel = undefined;

    if (model && id) {
      objectModel = await model.findById(id).select("_id");
    }
    return objectModel; // undefined or user
  } catch (err) {
    console.error(error);
  }
};

module.exports = {
  userControl,
};
