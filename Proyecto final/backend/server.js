// ============================
// 🔰 IMPORTAR DEPENDENCIAS
// ============================
import express from "express";
import mysql from "mysql2";
import cors from "cors";

// ============================
// 🔰 CONFIGURACIÓN BASE
// ============================
const app = express();
app.use(cors());
app.use(express.json());

// ============================
// 🔰 CONEXIÓN A LA BASE DE DATOS
// ============================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vidal", // tu contraseña si tienes una
  database: "empleo_corredor"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con MySQL:", err);
    return;
  }
  console.log("✅ Conectado a la base de datos empleo_corredor");
});

// ============================
// 🔰 RUTA DE REGISTRO
// ============================
app.post("/registro", (req, res) => {
  const { nombre, correo, password, tipo } = req.body;

  if (!nombre || !correo || !password || !tipo) {
    return res.status(400).json({ success: false, message: "Datos incompletos" });
  }

  const sql = "INSERT INTO usuarios (nombre, correo, password, tipo, fecha_registro) VALUES (?, ?, ?, ?, NOW())";
  db.query(sql, [nombre, correo, password, tipo], (err, result) => {
    if (err) {
      console.error("❌ Error al registrar usuario:", err);
      return res.status(500).json({ success: false, message: "Error en el servidor" });
    }

    res.json({ success: true, message: "Usuario registrado correctamente" });
  });
});

// ============================
// 🔰 RUTA DE LOGIN
// ============================
app.post("/login", (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ success: false, message: "Datos incompletos" });
  }

  const sql = "SELECT * FROM usuarios WHERE correo = ? AND password = ?";
  db.query(sql, [correo, password], (err, result) => {
    if (err) {
      console.error("❌ Error al verificar el usuario:", err);
      return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }

    if (result.length > 0) {
      const user = result[0];
      res.json({ success: true, message: "Inicio de sesión exitoso", user });
    } else {
      res.json({ success: false, message: "Correo o contraseña incorrectos" });
    }
  });
});

// ============================
// 🔰 SERVIR ARCHIVOS ESTÁTICOS
// ============================
app.use(express.static("public"));

// ============================
// 🔰 INICIAR SERVIDOR
// ============================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

/*  cd "Proyecto final/backend" */