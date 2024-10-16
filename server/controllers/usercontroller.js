let users = require('../db/models/user');
const { success_function, error_function } = require('../util/userresponce')
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendemail = require('../util/send_email').sendEmail
// const resetpassword = require('../util/Email_template/setpassword').resetPassword
const resetpasswords = require('../util/Email_template/resetPassword').resetPassword
const sendOtpEmail = require('../util/Email_template/otpmail').sendOtpEmail
const fileUpload = require('../util/uploads').fileUpload;
const dotevn = require('dotenv');
dotevn.config();
// const otp =require('generateotp-ts')
const crypto = require('crypto');
    

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}
let otpStore = {};
exports.create1 = async function (req, res) {
  try {
    let body = req.body;
    let email = body.email;
    let name = body.name;
    let image = body.image;
    let phoneno = body.phoneno
    let password = body.password

    if (image) {
      let image_path = await fileUpload(image, "users");
      body.image = image_path;
    }

    let otp = generateOTP();
    console.log(`Generated OTP: ${otp}`);

    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);

    otpStore[otp] = {
      email,
      name,
      phoneno,
      password: hashedPassword,
      image: body.image, 
      expirationTime: Date.now() + 5 * 60 * 1000
    };

    // let content =  await sendOtpEmail(email,name,otp)
    // await sendemail(email,"otp Verification",content);

    return res.status(200).send({
      success: true,
      message: "OTP has been sent to your email. Please verify."
    });

  } catch (error) {
    console.log("error : ", error);
    let response = {
      success: false,
      statuscode: 400,
      message: "Error while sending OTP"
    };
    return res.status(response.statuscode).send(response);
  }
};

exports.verifyOtp = async function (req, res) {
  try {
    let { otp } = req.body;
    

    if (!otpStore[otp] || otpStore[otp].expirationTime < Date.now()) {
      return res.status(400).send({
        success: false,
        message: "OTP expired or invalid. Please request a new OTP."
      });
    }

    let { email, name, image, phoneno ,password } = otpStore[otp];

    let userData = {
      name,
      email,
      password,
      image: image,
      phoneno,
      password
    };

    let newUser = await users.create(userData);

    delete otpStore[otp]; 
    return res.status(200).send({
      success: true,
      message: "User registered successfully.",
      data: newUser
    });

  } catch (error) {
    console.log("error : ", error);
    return res.status(400).send({
      success: false,
      message: "Error occurred during OTP verification."
    });
  }
};

exports.getsingle = async function (req,res){
  try {

      Singleid = req.params.id
      console.log("Singleid",Singleid);

      SingleData = await users.findOne({_id :Singleid});
      console.log("SingleUser",SingleData);

      let response = success_function({
       success: true,
       statuscode: 200,
       data : SingleData,
       message: "successfully get the single data.."
   })
   res.status(response.statuscode).send(response)
   return;

} catch (error) {

   console.log("error : ", error);
   let response = error_function({
       success: false,
       statuscode: 400,

       message: "error"
   })
   res.status(response.statuscode).send(response)
   return;
}

}

exports.resetPassword =async function(req,res){
  try {
      
      _id =req.params.id;
      console.log(_id)

      let user = await users.findOne({_id : _id});
      console.log("user",user)

      let passwordMatch =  bcrypt.compareSync(req.body.password,user.password);
      console.log("passwordMatch",passwordMatch);

      if(passwordMatch){
          let newpassword = req.body.newpassword;

          let salt = bcrypt.genSaltSync(10);
          let hashed_password = await bcrypt.hash(newpassword,salt);

          console.log("hashed_password",hashed_password)


          req.body.password=hashed_password
          console.log("new password",req.body.password)



          let updatePassword = await users.updateOne({_id},{$set:{password : req.body.password}});
          console.log(updatePassword)

          
          let response = success_function({
              success: true,
              statuscode: 200,
              data :updatePassword,
              message: "Password reset completed successfully..."
          })
          res.status(response.statuscode).send(response)
          return;


      }

  } catch (error) {
      console.log("error : ", error);
      let response = error_function({
          success: false,
          statuscode: 400,
          message: "error"
      })
      res.status(response.statuscode).send(response)
      return;
  }



    
}


exports.forgetPassword = async function (req, res) {
  try {
    let email = req.body.email;
    if (email) {
      let user = await users.findOne({ email: email });
      console.log("user", user);

      if (user) {
        let reset_token = jwt.sign(
          { user_id: user._id },
          process.env.PRIVATE_KEY,
          { expiresIn: "10m" }
        );

        let data = await users.updateOne(
          { email: email },
          { $set: { password_token: reset_token } }
        );
        console.log("email for update:", email);
        console.log("user found:", reset_token);
        console.log("data : ",data)


        if (data.matchedCount === 1 && data.modifiedCount == 1) {
          let reset_link = `${process.env.FRONTEND_URL}/reset-password?token=${reset_token}`;
          let email_template = await resetpasswords(user.first_name, reset_link);
          sendemail(email, "Forgot password", email_template);
          let response = success_function({
            status: 200,
            message: "Email sent successfully",
          });
          res.status(response.statuscode).send(response);
          return;
        } else if (data.matchedCount === 0) {
          let response = error_function({
            status: 404,
            message: "User not found",
          });
          res.status(response.statuscode).send(response);
          return;
        } else {
          let response = error_function({
            status: 400,
            message: "Password reset failed",
          });
          res.status(response.statuscode).send(response);
          return;
        }
      } else {
        let response = error_function({ status: 403, message: "Forbidden" });
        res.status(response.statuscode).send(response);
        return;
      }
    } else {
      let response = error_function({
        status: 422,
        message: "Email is required",
      });
      res.status(response.statuscode).send(response);
      return;
    }
  } catch (error) {
    console.log("Error in forgetPassword:", error);
    let response = error_function({
      status: 500,
      message: "Internal Server Error",
    });
    res.status(response.statuscode).send(response);
  }
};

exports.passwordResetController = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];

    let password = req.body.password;
    console.log("password :",password);

    decoded = jwt.decode(token);
    console.log("decode : ",decoded)

    let user = await users.findOne({
      $and: [{ _id: decoded.user_id }, { password_token: token }],
    });
    console.log("user",user)
    if (user) {
      let salt = bcrypt.genSaltSync(10);
      let password_hash = bcrypt.hashSync(password, salt);
      let data = await users.updateOne(
        { _id: decoded.user_id },
        { $set: { password: password_hash, password_token: null } }
      );
      if (data.matchedCount === 1 && data.modifiedCount == 1) {
        let response = success_function({
          status: 200,
          message: "Password changed successfully",
        });
        res.status(response.statuscode).send(response);
        return;
      } else if (data.matchedCount === 0) {
        let response = error_function({
          status: 404,
          message: "User not found",
        });
        res.status(response.statuscode).send(response);
        return;
      } else {
        let response = error_function({
          status: 400,
          message: "Password reset failed",
        });
        res.status(response.statuscode).send(response);
        return;
      }
    }else{
      let response = error_function({ status: 403, message: "Forbidden" });
    res.status(response.statuscode).send(response);
    return;
    }

    
  }  catch (error) {
    console.log("error : ", error);
    let response = error_function({
        success: false,
        statuscode: 400,
        message: "error"
    })
    res.status(response.statuscode).send(response)
    return;
  }
};