require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Product = require("./product");
const UserModel = require("./model/user.model");
const userRouter = require("./routers/user.router");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");
const OtpModel = require("./model/otpSchema");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use("/", userRouter);
const db = require("./config/db");
const { generateOtp } = require("./services/user.services");

const productData = [];
const PORT = process.env.PORT || 2000;
const MONGO_URL = process.env.MONGO_URL;

const accountSid = process.env.accountSid_;
const authToken = process.env.authToken_;
const verifySid = process.env.verifySid_;
const client = require("twilio")(accountSid, authToken);

module.exports = {
  client,
};

db.once("open", async () => {
  try {
    console.log("connected to mongodb");
    //post api
    app.post("/api/add_product", async (req, res) => {
      console.log("req = ", req.body);
      try {
        const { name, isOpen, rating, imageURL, distance } = req.body;

        const isOpenBool = isOpen === "true";

        let data = new Product({
          name,
          isOpen: isOpenBool,
          rating,
          imageURL,
          distance,
        });
        // print("the data here =  ", data);

        let dataToStore = await data.save();

        res.status(200).json(dataToStore);
      } catch (e) {
        res.status(400).json({
          status: error.message,
        });
        print("error at catch post :", e);
      }

      // const pdata = {
      //   id: productData.length + 1,
      //   pname: req.body.pname,
      //   pprice: req.body.pprice,
      //   pdesc: req.body.pdesc,
      // };

      // productData.push(pdata);
      // console.log("final", pdata);

      // res.status(200).send({
      //   statusCode: "200",
      //   message: "product added successfully",
      //   product: pdata,
      // });
    });

    //get api
    app.get("/api/get_product/", async (req, res) => {
      try {
        let data = await Product.find();
        res.status(200).json(data);
      } catch (e) {
        res.status(500).json(error.message);
      }
      // if (productData.length > 0) {
      //   res.status(200).send({
      //     statusCode: "200",
      //     products: productData,
      //   });
      // } else {
      //   res.status(200).send({
      //     statusCode: "200",
      //     products: [],
      //   });
      // }
    });

    app.post("/api/send-otp/", (req, res) => {
      const { phoneNumber } = req.body;
      const otp = generateOtp;
      const otpDocument = new OtpModel({ phoneNumber, otp });
      otpDocument.save();

      client.verify.v2
        .services(verifySid)
        .verifications.create({ to: phoneNumber, channel: "sms" })
        .then((verification) => console.log(verification.status))
        .then(() => {
          res.send({ success: true, otp: otp });
        })
        .catch((err) => {
          console.error("error in creating message", err);
          res
            .status(500)
            .send({ success: false, error: "failed to send opt", err });
        });
    });

    app.post("/api/verify-otp/", async (req, res) => {
      const { phoneNumber, userOtp } = req.body;
      try {
        const otpDocument = await OtpModel.findOne({
          phoneNumber,
          otp: userOtp,
        });

        client.verify.v2
          .services(verifySid)
          .verificationChecks.create({ to: phoneNumber, code: userOtp })
          .then((verification_check) => console.log(verification_check.status))
          .then(() => console.log("success login"));

        if (otpDocument) {
          res.send({ success: true });
        } else {
          res.status(401).send({ success: false, error: "Invalid otp" });
        }
      } catch (e) {
        console.error(e);
      }
    });
  } catch (e) {
    console.log("ERROR connected to mongodb", error);
  }
});

app.listen(PORT, () => {
  console.log("connect to the server at ", PORT);
});
