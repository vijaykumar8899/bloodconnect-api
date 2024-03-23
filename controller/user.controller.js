//handle req and res here
//calling service folder;

const UserService = require("../services/user.services");
const OtpModel = require("../model/otpSchema");
const { client } = require("../app.js");

exports.register = async (req, res, next) => {
  try {
    const { email, password, age, sex, blood_group, address } = req.body;
    const successRes = await UserService.registerUser(
      email,
      password,
      age,
      sex,
      blood_group,
      address
    );

    res.json({
      status: true,
      success: "User registered succesfully",
      successres: successRes,
    });
  } catch (e) {
    throw e;
  }
};

exports.login = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    const user = await UserService.UserCheck(phoneNumber);

    const token = "";

    if (!user) {
      // throw new Error("User not exist!");
      console.log("new user");
      res.status(200).json({ status: false, token: token });
    }

    // const isMatch = await user.comparePassword(password);
    // if (isMatch === false) {
    //   throw new Error("wrong password!");
    // }

    // let tokenData = { _id: user._id, email: user.email };
    // token = await UserService.generateToken(tokenData, "secretKey", "1h");

    res.status(200).json({ status: true, token: token, userData: user });
  } catch (e) {
    throw e;
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const data = await UserService.GetUserDetails();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).send({ error: "error fetching data of users ", e });
  }
};

// exports.loginWithOtp = async (req, res) => {
//   const { phoneNumber } = req.body;

//   const otp = UserService.callingOtpSchema(phoneNumber);
//   console.log("otp : ", otp);

//   //save otp to mongodb

//   client.messages
//     .create({
//       body: `Your OTP is ${otp}`,
//       from: "+16813373322",
//       to: phoneNumber,
//     })
//     .then(() => {
//       res.send({ success: true, otp: otp });
//     })
//     .catch((err) => {
//       console.error("error in creating message", err);
//       res.status(500).send({ success: false, error: "failed to send opt" });
//     });
// };

exports.verfityOtp = async (req, res) => {
  const { phoneNumber, userOtp } = req.body;
  try {
    const otpDocument = await OtpModel.findOne({ phoneNumber, otp: userOtp });

    if (otpDocument) {
      res.send({ success: true });
    } else {
      res.status(401).send({ success: false, error: "Invalid otp" });
    }
  } catch (e) {
    console.error(e);
  }
};
