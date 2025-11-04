document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password })
    });

    const data = await response.json();

    if (data.success) {
      alert("✅ Inicio de sesión exitoso");
      // Guardar datos del usuario en localStorage (opcional)
      localStorage.setItem("usuario", JSON.stringify(data.user));
      // Redirigir a la página principal
      window.location.href = "principal.html";
    } else {
      alert("❌ " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("⚠️ Error al conectar con el servidor");
  }
});
