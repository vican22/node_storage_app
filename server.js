const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./config/database");
const routes = require("./routes/index");

const app = express();
app.use(bodyParser.json());
app.use(routes);

let port = 5000 || process.env.PORT;

app.get("/hello", (req, res) => {
  res.send({ express: "Hello from server" });
});

sequelize.sync().then(() => {
  // User.create({ Username: 'user', PasswordHash: 'password' });

  app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
  });
});
