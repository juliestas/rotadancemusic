let stripeUrlSeleccionada = '';

// 1. Mostrar la tarjeta de formulario y asignar el enlace Stripe correspondiente
function seleccionarCuota(tipo, linkStripe) {
  stripeUrlSeleccionada = linkStripe;
  const formContainer = document.getElementById('formularioDatos');
  const titulo = document.getElementById('tituloFormulario');
  
  if (tipo === 'colaborador') {
    titulo.textContent = 'Datos para inscripción: Socio Colaborador (30€/año)';
  } else {
    titulo.textContent = 'Datos para inscripción: Socio DJ / Productor (50€/año)';
  }

  formContainer.classList.add('active');
  formContainer.scrollIntoView({ behavior: 'smooth' });
}

// 2. Controlar la aparición del campo "Otro" al marcar su casilla
function toggleOtroGenero() {
  const checkOtro = document.getElementById('check-otro');
  const grupoOtro = document.getElementById('grupo-otro-genero');
  const generoCustom = document.getElementById('genero-custom');

  if (checkOtro && checkOtro.checked) {
    grupoOtro.style.display = 'block';
    generoCustom.required = true;
  } else {
    grupoOtro.style.display = 'none';
    generoCustom.required = false;
    generoCustom.value = '';
  }
}

// 3. Procesar el pago y guardar datos en sessionStorage
function procesarPago(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const extra = document.getElementById('extra').value.trim();

  // Validación de teléfono (mínimo 9 dígitos)
  const telefonoLimpio = telefono.replace(/[\s\+\-\(\)]/g, '');
  if (telefonoLimpio.length < 9) {
    alert("Por favor, introduce un número de teléfono válido (mínimo 9 dígitos).");
    document.getElementById('telefono').focus();
    return;
  }

  // Recoger géneros marcados
  let generosSeleccionados = [];
  document.querySelectorAll('input[name="generos"]:checked').forEach((cb) => {
    if (cb.value !== 'otro') {
      generosSeleccionados.push(cb.value);
    }
  });

  // Si marcaron "Otro", añadir el texto especificado
  const checkOtro = document.getElementById('check-otro');
  if (checkOtro && checkOtro.checked) {
    const textoCustom = document.getElementById('genero-custom').value.trim();
    if (textoCustom) {
      generosSeleccionados.push(textoCustom);
    }
  }

  // Guardar en sessionStorage
  sessionStorage.setItem('userData', JSON.stringify({
    nombre,
    telefono,
    extra,
    generos: generosSeleccionados
  }));

  // Redireccionar al Checkout de Stripe
  if (stripeUrlSeleccionada) {
    window.location.href = stripeUrlSeleccionada;
  } else {
    alert("Por favor, selecciona una tarifa de socio arriba para continuar.");
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");

  // Si ya aceptó antes, lo ocultamos
  if (localStorage.getItem("cookiesAccepted") === "true") {
    banner.classList.add("hidden");
  }

  // Al hacer clic, guardamos la preferencia y ocultamos
  acceptBtn.addEventListener("click", function() {
    localStorage.setItem("cookiesAccepted", "true");
    banner.classList.add("hidden");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  
  // 1. LÓGICA DEL PRELOADER
  window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("fade-out");
    }
  });

  // 2. LÓGICA DE LA FLECHA PARA SUBIR
  const backToTopBtn = document.getElementById("back-to-top");

  if (backToTopBtn) {
    // Mostrar u ocultar la flecha según el scroll (se activa a los 300px)
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    // Al hacer clic, sube suavemente al inicio
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

});

document.addEventListener("DOMContentLoaded", function () {
  
  // 1. Carga modular de componentes (Menú y Footer)
  function loadComponent(placeholderId, filePath) {
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      fetch(filePath)
        .then(response => {
          if (!response.ok) throw new Error(`No se pudo cargar ${filePath}`);
          return response.text();
        })
        .then(data => {
          placeholder.innerHTML = data;
        })
        .catch(error => console.error(error));
    }
  }

  loadComponent("nav-placeholder", "nav.html");
  loadComponent("footer-placeholder", "footer.html");

  // 2. Control del Preloader (con fallback de seguridad a los 2s)
  const preloader = document.getElementById("preloader");
  if (preloader) {
    const hidePreloader = () => {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    };

    // Ocultar al cargar la página por completo
    window.addEventListener("load", hidePreloader);

    // Fallback de seguridad de 2 segundos por si falla algún recurso
    setTimeout(hidePreloader, 2000);
  }

  // 3. Botón Scroll-to-Top
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

});
