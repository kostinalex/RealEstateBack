var settings = require("../appsettings.json");
var help = require("../HelpfullService/help.js");

async function getPostings(req, res, next) {
  try {
    res.send({ hello: "hello and poka1" });
  } catch (err) {
    console.error("Error", err.message);
    next(err);
  }
}

module.exports = {
  getPostings,
};
