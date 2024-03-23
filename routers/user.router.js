//all api's here
//calling controller :

const {
  register,
  login,
  getUserDetails,
} = require("../controller/user.controller");

const router = require("express").Router();

router.post("/registration", register);
router.post("/login", login);
router.post("/getUserDetails", getUserDetails);

// router.post("/loginwithotp", loginWithOtp);

module.exports = router;
