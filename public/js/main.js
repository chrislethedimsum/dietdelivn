(function ($) {

    "use strict";

    // Preloader
    $(window).on('load', function () {
        $('#preloader').delay(350).fadeOut('slow');
        $('body').delay(350).css({ 'overflow': 'visible' });
    })

    $(".hero-carousel").owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        nav: false,
        dots: true,
        dotsEach: false,
        autoplay: true,
    });
    $('select').niceSelect();
    $('.no-nice-select').niceSelect('destroy');
    $(".popular-posts-wrapper").owlCarousel({
        loop: true,
        margin: 20,
        nav: false,
        dots: true,
        dotsEach: false,
        autoplay: true,
        responsive: {

            0: {

                items: 1
            },

            480: {

                items: 1
            },

            768: {

                items: 2
            },
            992: {
                items: 3
            }
        }
    });


    $(".popular-posts-wrapper-2").owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        dots: true,
        dotsEach: false,
        autoplay: true,
        responsive: {

            0: {

                items: 1
            },

            480: {

                items: 1
            },

            768: {

                items: 2
            },
            992: {
                items: 2
            }
        }
    });


    $(".reviews-wrapper").owlCarousel({
        loop: true,
        margin: 0,
        nav: false,
        dots: true,
        dotsEach: true,
        autoplay: true,
        center: true,
        responsive: {

            0: {

                items: 1
            },

            480: {

                items: 1
            },

            768: {

                items: 2
            },
            992: {
                items: 3
            }
        }
    });

    // Counter Init
    $('.counter').counterUp({
        delay: 20,
        time: 3000
    });
    // Scrollup Init
    $.scrollUp({
        scrollName: 'scrollUp', // Element ID
        topSpeed: 300, // Speed 
        animation: 'fade',
        animationInSpeed: 200,
        scrollText: '<i class="fas fa-chevron-up">', // Text for element <i class="flaticon-up-arrow">
    });



})(jQuery);