const express = require('express');
const routes = require('./routes');
// import sequelize connection
const sequelize = require('./config/connection');

// path 
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // This midleware is to read req.body.
app.use(express.urlencoded({ extended: true })); // Extending The Request Size.

// Registering API Routes.
app.use(routes);

// sync sequelize models to the database, then turn on the server

sequelize.sync({force: false}).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
})
