const forge = require("node-forge");

// function to encrypt a message using the public key
function encryptMessage(message, publicKey) {
  const encrypted = forge.pki.publicKeyFromPem(publicKey).encrypt(message);
  return forge.util.encode64(encrypted);
}

// function to decrypt a message using the private key
function decryptMessage(encoded, privateKey) {
  const encrypted = forge.util.decode64(encoded);
  const decrypted = forge.pki.privateKeyFromPem(privateKey).decrypt(encrypted);
  return decrypted;
}

module.exports = {
  encryptMessage,
  decryptMessage,
};
