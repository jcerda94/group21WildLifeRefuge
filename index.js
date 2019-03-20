const fs = require("fs");
const path = require("path");
const https = require("https");
const privateKey = fs.readFileSync("./sslcerts/privkey.pem", "utf8");
const certificate = fs.readFileSync("./sslcerts/cert.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };
const express = require("express");
const app = express();

app.use("/static", express.static("./build/static"));
app.use("/models", express.static("./build/models"));
app.use("/assets", express.static("./build/assets"));

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "./build/index.html"))
);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(3000, () => {
  console.log("Listening for connections ...");
});
