(function () {
  if (typeof jQuery === 'undefined') return;
  var $ = jQuery;

  $(document).ready(function () {
    $('.navbar-collapse a').on('click', function () {
      $('.navbar-collapse').collapse('hide');
    });

    // AOS Initialization moved to animations.js

    $('.navbar a').on('click', function (event) {
      var href = $(this).attr('href');
      if (!href || href === '#' || href.indexOf('#') !== 0) return;
      event.preventDefault();
      var target = $(href);
      if (target.length) {
        $('html, body').stop().animate(
          { scrollTop: target.offset().top - 49 },
          780,
          function () {
            $('.nav-link').removeClass('active');
            $(event.target).closest('.nav-link').addClass('active');
          }
        );
      }
    });

    function updateActiveSection() {
      var scrollPos = $(document).scrollTop();
      $('.nav-link').each(function () {
        var section = $($(this).attr('href'));
        if (section.length) {
          var sectionTop = section.offset().top - 50;
          var sectionBottom = sectionTop + section.outerHeight();
          if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
            $('.nav-link').removeClass('active');
            $(this).addClass('active');
          }
        }
      });
    }
    $(window).on('scroll', updateActiveSection);
  });
})();
