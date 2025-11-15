document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const tipo = document.getElementById("tipo").value;

  try {
    const response = await fetch("http://localhost:3000/registro", { // ✅ RUTA CORRECTA
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, password, tipo })
    });

    const data = await response.json();
    if (data.success) {
      alert("✅ Usuario registrado correctamente");
      document.getElementById("registerForm").reset();
    } else {
      alert("⚠️ " + data.message);
    }

  } catch (error) {
    console.error("Error al registrar:", error);
    alert("⚠️ No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
  }
});



