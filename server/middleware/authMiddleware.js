const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {

  console.log("AUTH HEADER:", req.headers.authorization); // ✅ ADD THIS

  let token;

  try {

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = decoded.id;

      next();

    } else {
      res.status(401).json({
        message: "Not authorized"
      });
    }

  } catch (error) {
    res.status(401).json({
      message: "Token failed"
    });
  }
};

module.exports = protect;