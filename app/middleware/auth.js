const users = require("../models/users");
const jwt = require("jsonwebtoken");

const Admin = async (req, res, next) => {
    const token = req.headers["authorization"];
    const string = token.split(" ");
    const user = await users.findOne({
        where: { token: string[1] },
    });
    if (user.role === 'admin' || user.role === 'user') {
        try {
            jwt.verify(string[1], process.env.SECRET_KEY);
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
}
module.exports = Admin