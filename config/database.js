const Sequelize = require("sequelize");

const sequelize = new Sequelize("file-storage-app-db", "root", "rootroot", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
