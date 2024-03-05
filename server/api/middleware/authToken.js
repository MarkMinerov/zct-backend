import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";

const privateKey = fs.readFileSync("jwtRS256.key").toString();

export default (req, res, next) => {
  const { token } = req.body;

  if (!token) return res.json({ status: 403, text: "Auth token not provided!" });

  try {
    const decoded = jwt.verify(token, privateKey);

    next();
  } catch (e) {
    return res.json({ status: 403, text: "Auth token is not correct!" });
  }
};
