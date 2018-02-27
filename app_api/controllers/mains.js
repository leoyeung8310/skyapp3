var mongoose = require('mongoose');
var Main = mongoose.model('Main');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* /api/main */
/* GET Main Info */
module.exports.mainReadLatestOne = function(req, res) {
  Main
    .findOne()
    .sort({createdOn: -1})
    .exec(function(err, main) {
      if (!main) {
        sendJSONresponse(res, 404, {
          "message": "No record found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      //console.log(main);
      sendJSONresponse(res, 200, main);
    });
};

/* POST a new main */
module.exports.mainCreate = function(req, res) {
  console.log(req.body);
  Main.create({
    version: req.body.version,
    description: req.body.description
  }, function(err, main) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(main);
      sendJSONresponse(res, 201, main);
    }
  });
};

/* PUT /api/main/:mainid */
module.exports.mainUpdateOne = function(req, res) {
  if (!req.params.mainid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, mainid is required"
    });
    return;
  }
  Main
    .findById(req.params.mainid)
    .exec(
      function(err, main) {
        if (!main) {
          sendJSONresponse(res, 404, {
            "message": "mainid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        main.version = req.body.version;
        main.description = req.body.description;
        main.save(function(err, main) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, main);
          }
        });
      }
    );
};

/* DELETE /api/main/:mainid */
module.exports.mainDeleteOne = function(req, res) {
  var mainid = req.params.mainid;
  console.log("mainid = "+ mainid);
  if (mainid) {
    Main
      .findByIdAndRemove(mainid)
      .exec(
        function(err, main) {
          if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          console.log("Main id " + mainid + " deleted");
          sendJSONresponse(res, 204, null);
        }
      );
  } else {
    sendJSONresponse(res, 404, {
      "message": "No mainid"
    });
  }
};
