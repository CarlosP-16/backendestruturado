const express = require("express");
const routes = express.Router();
const usuarioController = require("../controllers/usuarioController");
const upload = require("../config/multer");

// ========= CREATE =========
routes.post("/", upload.single("foto"), usuarioController.criar);

// ========= READ =========
routes.get("/", usuarioController.listar);
routes.get("/:id", usuarioController.buscarPorId);

// ========= UPDATE =========
routes.put("/:id", upload.single("foto"), usuarioController.atualizar);

// ========= DELETE =========
routes.delete("/:id", usuarioController.deletar);

module.exports = routes;