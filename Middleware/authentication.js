const { verifytoken } = require("../services/auth");

function authenticateUser(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = verifytoken(tokenCookieValue);
      req.user = userPayload;           
    } catch (error) {}

    return next();
  };
}

module.exports = {
    authenticateUser,
};
