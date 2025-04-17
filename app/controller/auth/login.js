const sequelize = require("../../connection/sequelize");
const Helper = require("../../helper/helper");
const users = require("../../models/users");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = await users.findOne({
            where: {
                email: email
            }
        })
        if (password == Helper.decryptPassword(query.password)) {
            let token = jwt.sign(
                { id: query.id, role: query.role },
                process.env.SECRET_KEY,
                {
                    expiresIn: "7d",
                }
            );
            const userInfo = await users.findByPk(query.id);
            userInfo.token = token;
            const usersData = await userInfo.save();
            return Helper.response(
                true,
                "You have logged in successfully!",
                {
                    userdata: usersData,
                    base_url: process.env.BASE_URL_IMG,
                },
                res,
                200
            );
        }else{
            return Helper.response(
                false,
                "Invalid Email or Password!",
                {},
                res,
                200
            );
        }
    } catch (error) {
        return Helper.response(
            "success",
            "Server Error",
            {error},
            res,
            200
        );
    }
}