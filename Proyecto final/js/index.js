// === index.js ===

// Espera a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
  const btnEntrar = document.getElementById("btnEntrar");

  btnEntrar.addEventListener("click", () => {
    // Redirige al login
    window.location.href = "login.html";
  });
});
