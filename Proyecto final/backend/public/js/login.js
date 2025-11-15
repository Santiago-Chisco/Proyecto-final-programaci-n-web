document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password })
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Inicio de sesión exitoso");

        // Guardamos el usuario en localStorage
       localStorage.setItem("usuarioActivo", JSON.stringify(data.user));
       console.log("Usuario guardado:", data.user);


        // Dependiendo del tipo redirigimos
        if (data.user.tipo === "EMPRESA") {
          window.location.href = "empresa.html";
        } else if (data.user.tipo === "CANDIDATO") {
          window.location.href = "candidato.html";
        } else {
          alert("Tipo de usuario desconocido");
        }
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("❌ No se pudo conectar con el servidor");
    }
  });
});



