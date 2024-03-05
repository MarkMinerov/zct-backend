import fs from "fs";
import "dotenv/config";
import { generateKeyPairSync } from "crypto";

let { privateKey } = await generateKeyPairSync("rsa", { modulusLength: 2048 });
privateKey = privateKey.export({ format: "pem", type: "pkcs1" });

fs.writeFile(process.env.JWT_TOKEN_FILENAME, privateKey, (err) => err && console.error(err));

console.info("RSA 2048-bit key generated and saved successfully!");
