const Helper = {};
const CryptoJS = require("crypto-js");
const os = require('os');
const users = require('../models/users')
const https = require("https");
const admin = require("../services/firebase");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
Helper.response = (status, message, data = [], res, statusCode) => {
  res.status(statusCode).json({
    status: status,
    message: message,
    data: data,
  });
};

Helper.encryptPassword = (password) => {
  var pass = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
  return pass;
};

Helper.decryptPassword = (password) => {
  var bytes = CryptoJS.AES.decrypt(password, process.env.SECRET_KEY);
  var originalPassword = bytes.toString(CryptoJS.enc.Utf8);
  return originalPassword;
};

Helper.dateFormat = async (date) => {
  const istDate = new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Use 12-hour format
    timeZone: "Asia/Kolkata",
  });

  return istDate
}



Helper.getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (let name in interfaces) {
    for (let iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1"; // Fallback in case no network is found
};

Helper.generateUniqueId = () => {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

Helper.parseDuration = (durationStr) => {
  const match = durationStr.match(/(\d+)h\s*(\d+)m/);
  if (!match) return 0;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours * 60 + minutes;
}

Helper.generateAppointmentNum = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); 
  return `${randomNumber}`;
};

Helper.verifyToken = async(token)=>{
  try {
    return jwt.verify(token,process.env.SECRET_KEY);
  } catch (err) {
    throw new Error(err.message);
  }

}



Helper.generateOrderNum = () => {
  return `ORD-${uuidv4().split('-')[0]}`; // Take first part for brevity
};








Helper.saveNotification = async (userId, deviceToken, platform, message) => {
    try {
        const existingNotification = await Notification.findOne({ where: { userId } });

        if (!existingNotification) {
        
            await Notification.create({
                userId: userId,
                deviceToken: deviceToken,
                platform: platform,
                message: message,
            });
            console.log("Notification record created successfully");
        } else {
            console.log("Notification record already exists for this user");
        }
    } catch (error) {
        console.error("Error saving notification:", error);
    }
};

Helper.sendPushNotification = async (deviceToken, title, message, data = {}) => {
  const stringifiedData = {};
  for (const key in data) {
    stringifiedData[key] = typeof data[key] === 'object'
      ? JSON.stringify(data[key])
      : String(data[key]);
  }

  const payload = {
    token: deviceToken,
    notification: {
      title,
      body: message
    },
    data: stringifiedData // full custom data payload here
  };

  try {
    await admin.messaging().send(payload);
    console.log("Push notification sent successfully");
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};

Helper.formatDate = (date) => {
  if (!date) return null;

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};





module.exports = Helper


