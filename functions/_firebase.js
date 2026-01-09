const admin = require('firebase-admin');

let initialized = false;

function initAdmin() {
  if (!initialized) {
    admin.initializeApp();
    initialized = true;
  }
}

module.exports = {
  admin,
  initAdmin
};
