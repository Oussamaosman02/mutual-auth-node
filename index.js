const https = require("https");
const fs = require("fs");
const forge = require("node-forge");

const options = {
  key: fs.readFileSync("server-key.pem"), // Path to your server's private key
  cert: fs.readFileSync("server-cert.pem"), // Path to your server's certificate
  ca: fs.readFileSync("server-ca.cer.cer"), // Path to the CA certificate used to verify client certificates
  requestCert: true, // Request clients to provide certificates
  rejectUnauthorized: false, // Reject connections from clients without a valid certificate
};

const server = https.createServer(options, (req, res) => {
  const clientCert = req.socket.getPeerCertificate();
  if (!clientCert || !clientCert.raw) {
    console.error("No client certificate provided or empty raw data.");
    res.statusCode = 400;
    res.end("Bad Request");
    return;
  }

  try {
    //   console.log({ clientCert });
    //   const clientCertData = JSON.parse(clientCert.raw);
    //   console.log({ clientCertData });
    //   // Convert the reversed JSON object back to a buffer
    //   const reversedBuffer = Buffer.from(JSON.stringify(clientCertData.data));
    //   console.log({ reversedBuffer });
    const fileName = "cert-client-raw.p12";
    fs.writeFileSync(fileName, clientCert.raw, "base64");
    console.log({ fileName });
    const p12Der = forge.util.decode64(clientCert.raw.toString("base64"));
    const p12Asn1 = forge.asn1.fromDer(p12Der, false);
    console.log({ p12Asn1 });
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false);
    const p12b64 = forge.util.encode64(p12.asn1.toDer().getBytes());
    fs.writeFileSync("output.p12", p12b64);
  } catch (err) {
    console.error(err);
  }
  res.writeHead(200);
  res.end(JSON.stringify({ data: Object.keys(clientCert), clientCert }));
});

server.listen(4443, () => {
  console.log("Server listening on port 4443");
});
