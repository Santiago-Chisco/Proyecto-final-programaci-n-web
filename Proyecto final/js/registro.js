// registro.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const tipo = document.getElementById("tipo").value;

    if (!nombre || !email || !password || !tipo) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Simulación mientras no tenemos backend
    console.log("Datos a enviar:", { nombre, email, password, tipo });

    // Simulación de espera (como si fuera el servidor)
    setTimeout(() => {
      alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "login.html";
    }, 1000);

    /* 
    🔗 FUTURA CONEXIÓN A BACKEND (cuando tengamos PHP o Node.js)
    fetch("backend/registro.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ nombre, email, password, tipo })
    })
      .then(res => res.text())
      .then(data => {
        if (data === "success") {
          alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
          window.location.href = "login.html";
        } else {
          alert("⚠️ Error al registrar. Intenta nuevamente.");
        }
      });
    */
  });
});

