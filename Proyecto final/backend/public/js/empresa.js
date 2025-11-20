document.addEventListener("DOMContentLoaded", () => {
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
    if (!user.tipo || user.tipo.toLowerCase() !== "empresa") {
      alert("Acceso denegado. Debes iniciar sesión como empresa.");
      window.location.href = "login.html";
      return;
    }

    console.log("🟢 Empresa autenticada:", user.nombre);

    // ✅ Cargar empleos de esta empresa
    async function cargarEmpleos() {
      try {
        const res = await fetch("http://localhost:3000/empleos");
        const data = await res.json();

        lista.innerHTML = "";

        // 🔎 Filtrar solo las vacantes de esta empresa
        const empleosEmpresa = data.filter(
          (emp) => emp.empresa === user.nombre
        );

        if (empleosEmpresa.length === 0) {
          lista.innerHTML = `<p class="placeholder">Aún no has publicado vacantes.</p>`;
          return;
        }

        // 🧱 Crear las tarjetas de cada empleo
        empleosEmpresa.forEach((emp) => {
          const card = document.createElement("div");
          card.classList.add("oferta-card");
          card.innerHTML = `
            <h3>${emp.titulo}</h3>
            <p>${emp.descripcion}</p>
            <small>📍 ${emp.ubicacion || "Ubicación no especificada"}</small><br>
            <button class="btnEliminar" data-id="${emp.id}">🗑️ Eliminar</button>
          `;
          lista.appendChild(card);
        });

        // 🗑️ Agregar eventos de eliminación
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
              cargarEmpleos(); // 🔁 refrescar lista
            } catch (error) {
              console.error("❌ Error al eliminar empleo:", error);
              alert("No se pudo eliminar la vacante.");
            }
          });
        });
      } catch (error) {
        console.error("❌ Error al cargar empleos:", error);
        lista.innerHTML = `<p>Error al cargar vacantes.</p>`;
      }
    }

    // ✅ Publicar nueva vacante
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nuevoEmpleo = {
        titulo: document.getElementById("titulo").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        ubicacion: document.getElementById("ubicacion").value.trim(),
        id_empresa: user.id,
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
        alert("No se pudo publicar la vacante.");
      }
    });

    cargarEmpleos(); // 🚀 inicial
  }, 200);
});
