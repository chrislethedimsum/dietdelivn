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


    var snapSlider = document.getElementById('price-slider-snap');

    noUiSlider.create(snapSlider, {
        start: [50, 200],
        snap: true,
        connect: true,
        range: {
            'min': 0,
            '5%': 25,
            '10%': 50,
            '15%': 75,
            '20%': 100,
            '25%': 125,
            '30%': 150,
            '35%': 175,
            '40%': 200,
            '45%': 225,
            '50%': 250,
            '55%': 275,
            '60%': 300,
            '65%': 325,
            '70%': 350,
            '75%': 375,
            '80%': 400,
            '85%': 425,
            '90%': 450,
            '95%': 475,
            'max': 500
        }
    });
    var snapValues = [
        document.getElementById('price-slider-snap-value-lower'),
        document.getElementById('price-slider-snap-value-upper')
    ];

    snapSlider.noUiSlider.on('update', function (values, handle) {
        snapValues[handle].innerHTML = values[handle];
    });


    var snapSlider = document.getElementById('rating-slider-snap');

    noUiSlider.create(snapSlider, {
        start: [0.5, 3],
        snap: true,
        connect: true,
        range: {
            'min': 0,
            '10%': 0.5,
            '20%': 1.0,
            '30%': 1.5,
            '40%': 2.0,
            '50%': 2.5,
            '60%': 3.0,
            '70%': 3.5,
            '80%': 4.0,
            '90%': 4.5,
            'max': 5
        }
    });
    var snapRatingValues = [
        document.getElementById('rating-slider-snap-value-lower'),
        document.getElementById('rating-slider-snap-value-upper')
    ];

    snapSlider.noUiSlider.on('update', function (values, handle) {
        snapRatingValues[handle].innerHTML = values[handle];
    });




})(jQuery);