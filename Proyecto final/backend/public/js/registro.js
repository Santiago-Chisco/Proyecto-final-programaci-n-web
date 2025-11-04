// Esperar a que el DOM cargue completamente
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Tomamos los valores del formulario
    const data = {
      nombre: document.getElementById("nombre").value.trim(),
      correo: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
      tipo: document.getElementById("tipo").value
    };

    // Validación rápida
    if (!data.nombre || !data.correo || !data.password || !data.tipo) {
      alert("⚠️ Por favor, completa todos los campos.");
      return;
    }

    try {
      // Enviar los datos al backend (ruta /usuarios)
      const res = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ " + result.message);
        // Redirigir al login después de registrarse
        window.location.href = "login.html";
      } else {
        alert("❌ Error al registrar: " + (result.error || "Intenta de nuevo."));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
    }
  });
});


