const jwt = require("jsonwebtoken");
require("dotenv/config");
const {Users } = require("../models/mongomodels")

module.exports = async (req, res, next) => {
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
  let users_data = await Users.findById(decodedToken.userId);
  if(users_data)
  {
    if(users_data.role != 'admin'){
      return res.status(401).send({
        'message': "Unauthorized access! You don't have permission do perform this access!",
        'status': false
      });
    }
  }else{
    return res.status(401).send({
      'message': "Authentication failed! User not found",
      'status': false
    });
  }
  req.isAuthenticated = true;
  req.headers.userId = decodedToken.userId;
  next();
};
