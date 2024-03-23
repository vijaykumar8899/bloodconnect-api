//all database operations here
const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");

class UserService {
  static async registerUser(email, password, age, sex, blood_group, address) {
    try {
      const createUser = new UserModel({
        email,
        password,
        age,
        sex,
        blood_group,
        address,
      });
      return await createUser.save();
    } catch (e) {
      console.log("error UserService ", e);
      return e;
    }
  }

  static async generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  // static async callingOtpSchema(phoneNumber) {
  //   try {
  //     // Generate OTP logic here
  //     const otp = this.generateOtp(); // Assuming you have a function to generate OTP
  //     // Save OTP to database
  //     const otpmodel = new OtpModel(phoneNumber, otp); // Assuming you have a function to save OTP to the database
  //     await otpmodel.save();
  //     return otp;
  //   } catch (error) {
  //     console.error("Error generating and saving OTP:", error);
  //     throw error;
  //   }
  // }

  //checking wether user exist or not
  static async UserCheck(email) {
    try {
      //here we are using findOne because without using it the database sending an object of email and id but not the email and pass!
      return await UserModel.findOne({ email });
    } catch (e) {}
  }

  //generating jwt token , and defining token expire time.
  static async generateToken(tokenData, secretKey, jwt_expire) {
    return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire });
  }

  static async GetUserDetails() {
    try {
      return UserModel.find();
    } catch (e) {
      return e;
    }
  }
}

module.exports = UserService;
