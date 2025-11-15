document.addEventListener("DOMContentLoaded", () => {
  // 🕒 Esperar un poco para asegurar que localStorage esté disponible
  setTimeout(() => {
    const form = document.getElementById("formEmpleo");
    const lista = document.getElementById("listaEmpleos");

    if (!form || !lista) {
      console.error("❌ No se encontraron los elementos del DOM");
      return;
    }

    // ✅ Leer usuario activo desde localStorage
    const userData = localStorage.getItem("usuarioActivo");

    if (!userData) {
      alert("Acceso denegado. Debes iniciar sesión como empresa.");
      window.location.href = "login.html";
      return;
    }

    const user = JSON.parse(userData);

    // ✅ Validar tipo de usuario
    if (!user.tipo || user.tipo.toUpperCase() !== "EMPRESA") {
      alert("Acceso denegado. Debes iniciar sesión como empresa.");
      window.location.href = "login.html";
      return;
    }

    console.log("🟢 Usuario autenticado:", user.nombre);

    // ✅ Cargar empleos publicados
    async function cargarEmpleos() {
      try {
        const res = await fetch("http://localhost:3000/empleos");
        const data = await res.json();

        lista.innerHTML = "";

        if (data.length === 0) {
          lista.innerHTML = `<p class="placeholder">Aún no hay vacantes publicadas.</p>`;
          return;
        }

        data.forEach((emp) => {
          const card = document.createElement("div");
          card.classList.add("oferta-card");
          card.innerHTML = `
            <h3>${emp.titulo}</h3>
            <p>${emp.descripcion}</p>
            <small>📍 ${emp.ubicacion || "Ubicación no especificada"}</small><br>
            <small>Publicado por: <strong>${emp.empresa}</strong></small>
            <br>
            <button class="btnEliminar" data-id="${emp.id}">Eliminar</button>
          `;
          lista.appendChild(card);
        });

        // 🗑️ Agregar evento de eliminación después de renderizar
        document.querySelectorAll(".btnEliminar").forEach((btn) => {
          btn.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            if (!confirm("¿Seguro que deseas eliminar esta vacante?")) return;

            try {
              const res = await fetch(`http://localhost:3000/empleos/${id}`, {
                method: "DELETE",
              });
              const data = await res.json();
              alert(data.message || "Vacante eliminada correctamente");
              cargarEmpleos(); // 🔁 recargar lista
            } catch (error) {
              console.error("❌ Error al eliminar empleo:", error);
              alert("No se pudo eliminar la vacante.");
            }
          });
        });
      } catch (error) {
        console.error("❌ Error al cargar empleos:", error);
      }
    }

    cargarEmpleos();

    // ✅ Publicar nueva vacante
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nuevoEmpleo = {
        titulo: document.getElementById("titulo").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        ubicacion: document.getElementById("ubicacion").value.trim(),
        id_empresa: user.id, // 🟢 ID de la empresa autenticada
      };

      if (!nuevoEmpleo.titulo || !nuevoEmpleo.descripcion) {
        alert("Por favor completa todos los campos obligatorios.");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/empleos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoEmpleo),
        });

        const data = await res.json();
        alert(data.message || "✅ Vacante publicada correctamente.");
        form.reset();
        cargarEmpleos();
      } catch (error) {
        console.error("❌ Error al publicar empleo:", error);
        alert("No se pudo publicar la vacante. Verifica el servidor.");
      }
    });
  }, 200); // ⏱️ Espera breve para asegurar que el localStorage esté listo
});
