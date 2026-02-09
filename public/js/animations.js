(function () {
  // ==========================================
  // CONFIGURACIÓN CENTRALIZADA DE ANIMACIONES
  // ==========================================
  const CONFIG = {
    aos: {
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      anchorPlacement: 'top-bottom',
      offset: 50 // Iniciar un poco antes
    },
    // Definición de tiempos (ms) para cada elemento o grupo
    delays: {
      // Navbar
      'navbar-brand': 150,
      'nav-item': { base: 100, step: 100 }, // Secuencial

      // Home Section
      'home-subtitle': 300,
      'home-title': 450,
      'home-btn': 500,
      'home-social-item': { base: 700, step: 0 },
      'home-quote': 800,

      // Secciones Generales (Títulos)
      'section-title': 200,
      'section-subtitle': 300,

      // About Section
      'about-name': 200,
      'about-title': 300,
      'about-desc': 400,
      'about-btn-group': { base: 500, step: 100 }, // Secuencial (CV, Proyectos, etc.)

      // Cards (Projects, Certifications, Experiences)
      'card-item': { base: 400, step: 150 }, // Secuencial
      'more-btn': 500,
      
      // Timeline (Experience)
      'timeline-item': 100
    }
  };

  // ==========================================
  // LÓGICA DE APLICACIÓN (Expuesta globalmente)
  // ==========================================
  
  window.applyGlobalAnimations = function() {
    // 1. Aplicar delays simples (elementos únicos)
    Object.keys(CONFIG.delays).forEach(key => {
      const delayVal = CONFIG.delays[key];
      
      // Si es un número simple, buscar elementos con data-anim-id="key"
      if (typeof delayVal === 'number') {
        const elements = document.querySelectorAll(`[data-anim-id="${key}"]`);
        elements.forEach(el => {
          el.setAttribute('data-aos-delay', delayVal);
        });
      }
      
      // Si es una secuencia (objeto con base/step), buscar grupos
      else if (typeof delayVal === 'object') {
        // Opción A: Elementos sueltos marcados con data-anim-group="key"
        const groupElements = document.querySelectorAll(`[data-anim-group="${key}"]`);
        
        // Agrupar por contenedor padre para reiniciar contador en cada sección si fuera necesario,
        // o simplemente aplicar globalmente si son únicos en pantalla.
        // Para simplificar: aplicamos secuencialmente por orden de aparición en DOM.
        // Si hay múltiples listas separadas (ej. nav vs footer), deberíamos procesarlas por separado.
        
        // Estrategia Mejorada: Buscar contenedores padres marcados como data-anim-container="key"
        // O simplemente asumir que data-anim-group="key" se reinicia por contenedor padre
        
        // Implementación simple: Todos los elementos del mismo grupo siguen una secuencia única global
        // a menos que estén dentro de un contenedor específico.
        // Para Navbar es una sola lista. Para Home Social es una sola lista.
        // Para Cards, hay varias secciones (Proyectos, Certs), así que el contador debería reiniciarse por sección.
        
        // Búsqueda de contenedores que tengan hijos de este grupo
        const containers = document.querySelectorAll(`[data-anim-container="${key}"]`);
        
        if (containers.length > 0) {
          containers.forEach(container => {
             const items = container.querySelectorAll(`[data-anim-item="${key}"]`);
             items.forEach((item, index) => {
               const delay = delayVal.base + (index * delayVal.step);
               item.setAttribute('data-aos-delay', delay);
             });
          });
        } else {
          // Fallback: buscar elementos sueltos globalmente (ej. nav-items si no definimos container)
          const items = document.querySelectorAll(`[data-anim-group="${key}"]`);
          items.forEach((item, index) => {
             const delay = delayVal.base + (index * delayVal.step);
             item.setAttribute('data-aos-delay', delay);
          });
        }
      }
    });
  }

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================
  document.addEventListener('DOMContentLoaded', function() {
    // 1. Aplicar atributos de delay al DOM
    if (window.applyGlobalAnimations) window.applyGlobalAnimations();

    // 2. Inicializar AOS con la configuración global
    if (typeof AOS !== 'undefined') {
      AOS.init(CONFIG.aos);
      
      // Re-trigger para contenido dinámico si fuera necesario
      window.addEventListener('load', () => AOS.refresh());
    }
  });

})();
