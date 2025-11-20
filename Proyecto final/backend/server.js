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
// 🔰 SERVIR ARCHIVOS ESTÁTICOS (MOVERLO ARRIBA)
// ============================
app.use(express.static("public"));

// ============================
// 🔰 RUTA DE REGISTRO
// ============================
app.post("/registro", (req, res) => {
  const { nombre, correo, password, tipo } = req.body;

  if (!nombre || !correo || !password || !tipo) {
    return res.status(400).json({ success: false, message: "Datos incompletos" });
  }

  const sql =
    "INSERT INTO usuarios (nombre, correo, password, tipo, fecha_registro) VALUES (?, ?, ?, ?, NOW())";

  db.query(sql, [nombre, correo, password, tipo], (err, result) => {
    if (err) {
      console.error("❌ Error al registrar usuario:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error en el servidor" });
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
    return res
      .status(400)
      .json({ success: false, message: "Datos incompletos" });
  }

  const sql = "SELECT * FROM usuarios WHERE correo = ? AND password = ?";
  db.query(sql, [correo, password], (err, result) => {
    if (err) {
      console.error("❌ Error al verificar el usuario:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }

    if (result.length > 0) {
      const user = result[0];
      res.json({
        success: true,
        message: "Inicio de sesión exitoso",
        user,
      });
    } else {
      res.json({
        success: false,
        message: "Correo o contraseña incorrectos",
      });
    }
  });
});


// ============================
// 🔰 RUTA PARA PUBLICAR EMPLEOS
// ============================
app.post("/empleos", (req, res) => {
  const { titulo, descripcion, ubicacion, id_empresa } = req.body;

  console.log("📩 Datos recibidos en /empleos:", req.body);

  if (!titulo || !descripcion || !id_empresa) {
    return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
  }

  const sql = `
    INSERT INTO empleos (titulo, descripcion, ubicacion, id_empresa)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [titulo, descripcion, ubicacion, id_empresa], (err, result) => {
    if (err) {
      console.error("❌ Error al registrar empleo:", err);
      return res.status(500).json({ success: false, message: "Error en el servidor" });
    }

    console.log("✅ Empleo agregado correctamente con ID:", result.insertId);
    res.json({ success: true, message: "✅ Vacante publicada correctamente" });
  });
});



// ============================
// 🔰 RUTA PARA ELIMINAR EMPLEOS
// ============================
app.delete("/empleos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10); // 🔥 aseguramos número

  console.log("🗑️ Eliminando empleo con ID:", id);

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "ID de empleo inválido"
    });
  }

  const sql = "DELETE FROM empleos WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar empleo:", err.sqlMessage);
      return res.status(500).json({
        success: false,
        message: "Error al eliminar el empleo",
        error: err.sqlMessage
      });
    }

    if (result.affectedRows === 0) {
      console.warn(`⚠️ No se encontró empleo con ID ${id}`);
      return res.status(404).json({
        success: false,
        message: "No se encontró el empleo especificado"
      });
    }

    console.log(`✅ Empleo con ID ${id} eliminado correctamente`);
    res.json({
      success: true,
      message: "Vacante eliminada correctamente 🗑️"
    });
  });
});


// ============================
// 🔰 RUTA PARA LISTAR EMPLEOS
// ============================
app.get("/empleos", (req, res) => {
  const sql = `
    SELECT e.id, e.titulo, e.descripcion, e.ubicacion, u.nombre AS empresa
    FROM empleos e
    JOIN usuarios u ON e.id_empresa = u.id
    ORDER BY e.fecha_publicacion DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener empleos:", err);
      return res.status(500).json({ success: false, message: "Error en el servidor" });
    }

    res.json(results);
  });
});

// ============================
// 🔰 RUTA PARA REGISTRAR POSTULACIONES
// ============================
app.post("/postulaciones", (req, res) => {
  const { id_usuario, id_empleo, carta_presentacion } = req.body;

  if (!id_usuario || !id_empleo) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  const checkSql = "SELECT * FROM postulaciones WHERE id_usuario = ? AND id_empleo = ?";
  db.query(checkSql, [id_usuario, id_empleo], (err, result) => {
    if (err) {
      console.error("❌ Error al verificar postulacion:", err);
      return res.status(500).json({ success: false, message: "Error en el servidor" });
    }

    if (result.length > 0) {
      return res.json({ success: false, message: "Ya te has postulado a esta vacante." });
    }

    const sql = `
      INSERT INTO postulaciones (id_usuario, id_empleo, carta_presentacion)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [id_usuario, id_empleo, carta_presentacion], (err2) => {
      if (err2) {
        console.error("❌ Error al registrar postulación:", err2);
        return res.status(500).json({ success: false, message: "Error al registrar postulación" });
      }

      res.json({ success: true, message: "✅ Postulación enviada correctamente" });
    });
  });
});

 
// ============================
// 🔰 RUTA PARA GUARDAR CURRÍCULUMS
// ============================
app.post("/curriculum", (req, res) => {
  const { id_usuario, telefono, educacion, experiencia, habilidades, carta_presentacion } = req.body;

  if (!id_usuario || !telefono || !educacion || !experiencia || !habilidades) {
    return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
  }

  // Evitar duplicados: un usuario solo puede tener un currículum
  const checkSql = "SELECT * FROM curriculums WHERE id_usuario = ?";
  db.query(checkSql, [id_usuario], (err, result) => {
    if (err) {
      console.error("❌ Error al verificar currículum:", err);
      return res.status(500).json({ success: false, message: "Error en el servidor" });
    }

    if (result.length > 0) {
      // Ya tiene uno → lo actualizamos
      const updateSql = `
        UPDATE curriculums
        SET telefono = ?, educacion = ?, experiencia = ?, habilidades = ?, carta_presentacion = ?, fecha_registro = NOW()
        WHERE id_usuario = ?
      `;
      db.query(
        updateSql,
        [telefono, educacion, experiencia, habilidades, carta_presentacion, id_usuario],
        (err2) => {
          if (err2) {
            console.error("❌ Error al actualizar currículum:", err2);
            return res.status(500).json({ success: false, message: "Error al actualizar currículum" });
          }
          return res.json({ success: true, message: "📝 Currículum actualizado correctamente" });
        }
      );
    } else {
      // No tiene uno → se inserta nuevo
      const insertSql = `
        INSERT INTO curriculums (id_usuario, telefono, educacion, experiencia, habilidades, carta_presentacion)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertSql,
        [id_usuario, telefono, educacion, experiencia, habilidades, carta_presentacion],
        (err3) => {
          if (err3) {
            console.error("❌ Error al guardar currículum:", err3);
            return res.status(500).json({ success: false, message: "Error al guardar currículum" });
          }
          return res.json({ success: true, message: "✅ Currículum guardado correctamente" });
        }
      );
    }
  });
});





// ============================
// 🔰 INICIAR SERVIDOR
// ============================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

/*  cd "Proyecto final/backend" */