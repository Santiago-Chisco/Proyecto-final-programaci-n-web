document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Aquí luego conectaremos con el backend o base de datos
    console.log("Iniciando sesión con:", email, password);

    // Simulación: redirigir a la página principal
    window.location.href = "principal.html";
  });
});