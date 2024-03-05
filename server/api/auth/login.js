import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";

const privateKey = fs.readFileSync("jwtRS256.key").toString();

export default (conn) => {
  return async (req, res) => {
    const { login, password } = req.body;

    const result = await conn.query(`SELECT login, password FROM users WHERE login='${login}'`);

    const user = result[0][0];
    if (!user) return res.json({ status: 400, text: "Login or password is incorrect!" });

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ login }, privateKey, { algorithm: "RS256", expiresIn: "30m" });
        res.json({ status: 200, token });
      } else {
        res.json({ status: 400, text: "Wrong password!" });
      }
    });
  };
};
