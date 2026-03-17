const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes/usuarioRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads de fotos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas de usuário
app.use("/usuarios", routes);

module.exports = app;