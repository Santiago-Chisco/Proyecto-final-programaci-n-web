

// index.js
// Espera a que el contenido del DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const btnEntrar = document.getElementById("btnEntrar");

  if (btnEntrar) {
    btnEntrar.addEventListener("click", () => {
      // Redirige al login
      window.location.href = "login.html";
    });
  }
});
