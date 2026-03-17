const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Garantir que a pasta uploads existe
const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

module.exports = {

  // ========= CREATE =========
  async criar(req, res) {
    try {
      const { nome, email, senha, tipoUsuario } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({
          erro: "Nome, email e senha são obrigatórios",
        });
      }

      const existe = await Usuario.findOne({ where: { email } });
      if (existe) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(409).json({ erro: "Email já cadastrado" });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const foto = req.file ? `/uploads/${req.file.filename}` : null;

      const usuario = await Usuario.create({
        nome,
        email,
        senha: senhaHash,
        tipoUsuario: tipoUsuario || 0,
        foto,
      });

      const usuarioJSON = usuario.toJSON();
      delete usuarioJSON.senha;

      return res.status(201).json(usuarioJSON);

    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= READ (LISTAR) =========
  async listar(req, res) {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ["senha"] },
        order: [["id", "ASC"]],
      });

      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const resultado = usuarios.map(u => {
        const user = u.toJSON();
        if (user.foto && !user.foto.startsWith("http")) {
          user.foto = `${baseUrl}${user.foto}`;
        }
        return user;
      });

      return res.json(resultado);

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= READ (POR ID) =========
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ["senha"] },
      });

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const user = usuario.toJSON();

      if (user.foto && !user.foto.startsWith("http")) {
        user.foto = `${baseUrl}${user.foto}`;
      }

      return res.json(user);

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= UPDATE =========
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha, tipoUsuario } = req.body;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      let novaSenha = usuario.senha;
      if (senha) {
        novaSenha = await bcrypt.hash(senha, 10);
      }

      let novaFoto = usuario.foto;
      if (req.file) {
        if (usuario.foto) {
          const fotoAntiga = path.join(__dirname, "..", "..", usuario.foto);
          if (fs.existsSync(fotoAntiga)) fs.unlinkSync(fotoAntiga);
        }
        novaFoto = `/uploads/${req.file.filename}`;
      }

      await usuario.update({
        nome: nome ?? usuario.nome,
        email: email ?? usuario.email,
        senha: novaSenha,
        tipoUsuario: tipoUsuario ?? usuario.tipoUsuario,
        foto: novaFoto,
      });

      const user = usuario.toJSON();
      delete user.senha;

      return res.json(user);

    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= DELETE =========
  async deletar(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      if (usuario.foto) {
        const fotoPath = path.join(__dirname, "..", "..", usuario.foto);
        if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
      }

      await usuario.destroy();

      return res.json({ sucesso: true, mensagem: "Usuário removido com sucesso" });

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },
};