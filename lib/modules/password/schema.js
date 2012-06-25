module.exports = {
    login: { type: String, unique: true }
  , salt: { type: String, select: false }
  , hash: { type: String, select: false }
};
