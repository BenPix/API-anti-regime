const express = require("express");
const app = express();
const session = require("express-session");

// moteur de vue

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: app.get("env") === "production)" }, // turned true in prod with https
  })
);

// routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.get("/api/test", (req, res) => {
  if (req.session.test === undefined) {
    req.session.test = 1;
  } else {
    req.session.test++;
  }
  if (req.session.test === 10) {
    req.session.destroy();
  }
  res.status(200).send({
    message: "bonjour, je suis votre serveur",
    vues: req.session ? req.session.test : "plus de sessions",
  });
});

app.get("/api/connexion", (req, res, next) => {
  let User = require("./model/user");
  try {
    User.exists(req.query.email, function (result) {
      res.status(200).json({ user: result });
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/connexion", (req, res, next) => {
  let User = require("./model/user");
  try {
    User.connect(req.body.email, req.body.password, function (result) {
      res.status(200).json({ result });
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/user", (req, res, next) => {
  let User = require("./model/user");
  try {
    User.find(req.query.id, function (result) {
      res.status(200).json({ user: result });
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/user", (req, res, next) => {
  try {
    let User = require("./model/user");
    User.create(req.body.user, function (result) {
      res.status(201).json({ message: "Utilisateur créé avec succès " });
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/weight", (req, res, next) => {
  let User = require("./model/user");
  try {
    User.weight(req.body.poids, req.body.date, req.body.userId, function (
      result
    ) {
      res.status(200).json({ message: "success", result });
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/weighings", (req, res, next) => {
  let User = require("./model/user");
  try {
    User.findWeighings(req.query.userId, function (results) {
      res.status(200).json({ results });
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/weighings", (req, res, next) => {
  let User = require("./model/user");
  try {
    User.deleteWeigh(req.query.weighId, function (result) {
      res.status(200).json({ message: "Pesée suppriméé avec succès " });
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/goal", (req, res, next) => {
  let User = require("./model/user");
  try {
    User.goal(req.body.userId, req.body.weight, req.body.deficit, function (
      result
    ) {
      res.status(201).json({
        message: "L'Objectif de l'utilisateur a été créé avec succès ",
      });
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/sport-depense", (req, res, next) => {
  let SportDepense = require("./model/sport-depense");
  try {
    SportDepense.read(function (results) {
      res.status(200).json({ results });
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/sport-depense-exemples", (req, res, next) => {
  let SportDepense = require("./model/sport-depense");
  try {
    SportDepense.readForExamples(function (results) {
      res.status(200).json({ results });
    });
  } catch (error) {
    next(error);
  }
});

// ce middleware provoque une erreur avec l'utilisation du site, mais pas avec postman
// donc il est désactivé pour le moment
/*
// middleware reached when no routes has been reached, to send a 'not found error 404' error
app.use((req, res, next) => {
  console.log("header sent ?" + res.headersSent);
  if (!res.headersSent) {
    const error = new Error("Page not found");
    error.status = 404;
    next(error);
  }
});
*/

// middleware catching errors send with next(error)
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
});

app.listen(8081, () => console.log(`Example app listening on port 8081!`));
