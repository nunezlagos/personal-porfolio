$(document).ready(function () {
  // Cierra el navbar en móviles cuando se hace clic en un enlace
  $('.navbar-collapse a').on('click', function () {
      $(".navbar-collapse").collapse('hide');
  });

  // Inicializar AOS
  AOS.init({
      duration: 500,
      anchorPlacement: 'center-bottom'
  });

  // Smooth Scroll con actualización manual de la clase "active"
  $('.navbar a').on('click', function (event) {
      event.preventDefault();

      var $anchor = $(this);
      var target = $($anchor.attr('href'));

      if (target.length) {
          $('html, body').stop().animate({
              scrollTop: target.offset().top - 49
          }, 780, function () {
              // REMOVER "ACTIVE" DE TODOS LOS LINKS
              $('.nav-link').removeClass("active");

              // AGREGAR "ACTIVE" SOLO AL ENLACE QUE SE CLICKEÓ
              $anchor.addClass("active");
          });
      }
  });

  // Detectar la sección activa en el navbar al hacer scroll manualmente
  function updateActiveSection() {
      var scrollPos = $(document).scrollTop();
      $('.nav-link').each(function () {
          var section = $($(this).attr("href"));
          if (section.length) {
              var sectionTop = section.offset().top - 50;
              var sectionBottom = sectionTop + section.outerHeight();
              if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                  $('.nav-link').removeClass("active");
                  $(this).addClass("active");
              }
          }
      });
  }

  $(window).on("scroll", updateActiveSection);
});
