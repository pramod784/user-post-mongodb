const jwt = require("jsonwebtoken");
require("dotenv/config");
module.exports = (req, res, next) => {
  const getHeader = req.get("Authorization");
  console.log("middleware called");
  if (!getHeader) {
    return res.status(401).send({
      'message': "Authentication failed!",
      'status': false
    });
  }
  const token = getHeader.split(" ")[1];
  if (!token || token === "") {
    return res.status(401).send({
      'message': "Authentication failed! Invalid Token",
      'status': false
    });
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRETE);
  } catch (err) {
    return res.status(401).send({
      'message': "Authentication failed! Invalid Token",
      'status': false
    });
  }
  if (!decodedToken) {
    return res.status(401).send({
      'message': "Authentication failed! Invalid Token",
      'status': false
    });
  }
  req.isAuthenticated = true;
  req.headers.userId = decodedToken.userId;
  next();
};
