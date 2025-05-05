const Helper = require("../helper/helper");
const users = require("../models/users");
const jwt = require("jsonwebtoken");

const Admin = async (req, res, next) => {
  try{
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return Helper.response(
            false,
            "Token not provided",
            [],
            res,
            200
        );
    }
    const decoded = await Helper.verifyToken(token);
    if (!decoded) {
        return Helper.response(
            false,
            "Invalid token",
            [],
            res,
            200
        );
    }
    const user = await users.findOne({
        where: { token: token },
    });
    if (user.role === 'admin' || user.role === 'user' || user.role === 'doctor') {
        try {
            req.users = {id:user.id,name:user.name,token:user.token,role:user.role};
            
                   
            next();
        } catch (error) {
            Helper.response(false, "Your Token is expired", {}, res, 200);
        }
    } else {
        return Helper.response(
            false,
            "Token Expired due to another login,Login Again!!",
            {},
            res,
            200
        );
    }

  }catch(err){
    return Helper.response(false, err.message, {}, res, 500);
  }
}

// exports.authenticate = async (req, res, next) => {
//     try {
//         const authHeader = req.headers["authorization"] || req.headers["Authorization"];
//         const token = authHeader && authHeader.split(" ")[1];
//         console.log(token);
  
//       if (token) {
//         const decoded = await Helper.verifyToken(token);
//         if (!decoded) {
//           return Helper.response(
//             false,
//             "Invalid token",
//             [],
//             res,
//            200
//           );
//         }
//         req.users = decoded;
//         next();
  
      
//         }
//         return Helper.response(
//           false,
//           "Token not provided",
//           [],
//           res,
//           200
//         );
//       }
//     catch (err) {
//       next(err);
//     }
//   };

// exports.Admin = async (req, res, next) => {
//     if (req.users.role !== "admin") {
//         return Helper.response(false, "You are not Admin", {}, res, 200);
//     }
//     next();
// }

// exports.User = async (req, res, next) => {
//     if (req.users.role !== "user") {
//         return Helper.response(false, "You are not User", {}, res, 200);
//     }
//     next();
// }
// exports.Doctor = async (req, res, next) => {
//     if (req.users.role !== "doctor") {
//         return Helper.response(false, "You are not doctor", {}, res, 200);
//     }
//     next();
// }


module.exports = {
    Admin
}
