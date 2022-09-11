var settings = require("../appsettings.json");
var request = require("request");

async function getListings(req, res, next) {
  try {
    let query = {
      bool: {
        must: [],
      },
    };

    if (req.body.address != undefined && req.body.address != "") {
      query.bool.must.push({
        wildcard: {
          Address: {
            value: "*" + req.body.address + "*",
            case_insensitive: true,
          },
        },
      });
    }

    if (req.body.minPrice != undefined) {
      query.bool.must.push({
        range: {
          Price: {
            gte: req.body.minPrice,
            lte: req.body.maxPrice,
          },
        },
      });
    }

    let fullQuery = {
      _source: [
        "Address",
        "Price",
        "Bathrooms",
        "Latitude",
        "Longitude",
        "Photo",
      ],
    };

    if (
      query.bool != undefined &&
      query.bool.must != undefined &&
      query.bool.must.length > 0
    ) {
      fullQuery.query = query;
    }

    let options = {
      method: "GET",
      url: "http://localhost:9200/listings/_search",
      headers: {
        "Content-Type": "application/json",
        Authorization: settings.ElasticAuth,
      },
      body: JSON.stringify(fullQuery),
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      let body = JSON.parse(response.body);
      console.log("response", body);
      if (response.statusCode == 200) {
        res.send({
          listings: body.hits.hits.map((c) => c["_source"]),
        });
      } else {
        res.send({
          statusCode: response.statusCode,
          error: body.error,
          listings: [],
        });
      }
    });
  } catch (err) {
    console.error("Error", err.message);
    next(err);
  }
}

module.exports = {
  getListings,
};
