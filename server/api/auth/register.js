import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";

const privateKey = fs.readFileSync(process.env.JWT_TOKEN_FILENAME).toString();
const SALT_ROUNDS = 10;

export default (conn) => {
  return async (req, res) => {
    const { login, email, password } = req.body;

    if (!login?.length || !email?.length || !password?.length) return;

    const result = await conn.query(`SELECT COUNT(*) AS accounts FROM users WHERE login='${login}'`);
    const accountsNum = result[0][0].accounts;

    if (accountsNum) return res.json({ status: 400, text: "Login already used" });

    bcrypt.hash(password, SALT_ROUNDS).then((hash) => {
      try {
        const result = conn.query(`INSERT INTO users (login, email, password) VALUES ('${login}', '${email}', '${hash}')`);
        const token = jwt.sign({ login }, privateKey, { algorithm: "RS256", expiresIn: "30m" });

        res.json({ status: 200, token });
      } catch (e) {
        res.json({ status: 500, text: "Internal server error!" });
        console.error(e);
      }
    });
  };
};
