var slideshow = {
  'config' : {

    // The maximum amount of slides avaliable
    'maxSlides' : 50,
    'container' : $('.container')

  },

  'init' : function(config){

    // provide for custom configuration via init()
    if (config && typeof(config) == 'object') {
      $.extend(slideshow.config, config)
    }

    maxSlides = slideshow.config.maxSlides;

    // DOM elements to use throughout the code
    $container  = slideshow.config.container;
    $slides     = $('ul.slides');
    $slide      = $container.find($slides + ' > li');
    $img        = $('ul.slides li.slides img');

    $next       = $('nav#controls a.next')
    $prev       = $('nav#controls a.prev')
    $control    = $('nav#controls a')

    winWidth    = $(window).width();
    winHeight   = $(window).height();
    slidesWidth = parseInt($('ul.slides').width());

    // Build
    if (!slideshow.initialized) {

      // Not very elegant, but we're blindfolded here and have to guess what files we might be dealing with
      slideshow.buildSlides('png');
      slideshow.buildSlides('jpg');
      slideshow.buildSlides('gif');

      slideshow.initialized = true;

    }
    // Finish up
    else {
      slideshow.loading();
      slideshow.removeErrorSlides();
      slideshow.sizeSlides();
      slideshow.sortSlides();
      slideshow.controls();
      slideshow.pagination();
    }

  },

  'loading' : function(){

    // Loading bar found at start of slideshow
    setTimeout(function(){
      $('.loading').fadeOut();
    },3000);

  },

  'buildSlides' : function(ext){

    for(var i = 1; i < maxSlides; i++){

      // Create slides
      $slides.append("<li class='" +ext+ " slide slide-"+i+"'></li>");

      //data- attribute used to sort
      $('li.slide-' + i).attr('data-sort', i);

      // Create img
      $('li.slide-' + i + "." + ext).append
      ("<img src='images/"+i+"."+ext+
      // Add class to img's with errors so we can remove them easily
      "'onerror=$(this).addClass('error')>");
    }

  },


  'removeErrorSlides' : function(){

    // Remove images that are broken
    $(".error").each(function(){
      $(this).parent().remove();
      $(this).remove();
    });
  },

  'sizeSlides' : function(){

    var len = $('li.slide').length;

    // Size ul
    $('ul.slides').width(len * winWidth + 'px')

    // Size li
    $('li.slide').width(winWidth + 'px');

    // Size images
    $('li.slide img').each(function(){

      // Handles big images
      if($(this).height() > winHeight){
        $(this).css('height', winHeight - 80 + 'px');
        $(this).css('margin-top', '40px');
      }

      var imgWidth = $(this).width();
      var imgHeight = $(this).height();

      // Center the image
      $(this).css('margin-left', (winWidth / 2) - (imgWidth / 2));
      $(this).css('margin-top', (winHeight / 2) - (imgHeight / 2));

    });
  },

  'sortSlides' : function(){

    var listItems = $slides.find('li.slide').sort(function(a,b){ return $(a).attr('data-sort') - $(b).attr('data-sort'); });

    $slide.remove();
    $slides.append(listItems);

  },

  'controls' : function() {

    $control.click(function(e){

      e.stopPropagation()

      // vars
      var end        = parseInt($('ul.slides').css('left'));
      var lastSlide  = winWidth - $('ul.slides').width() + winWidth;
      var firstSlide = 0 - winWidth;

      // Functions
      // Handles direction
      var slideSlides = function(direction){

        if(direction == 'left'){

          $('ul.slides').animate({
            left: '-=' + winWidth
          }, 500, function() {});

        } else {

          $('ul.slides').animate({
            left: '+=' + winWidth
          }, 500, function() {});

        }
      }

      //init

      // Next
      if($(this).hasClass('next')){

        slideSlides('left');

        // Handle active class
        $('li.slide.active').removeClass('active').next().addClass('active')


        // Style controls
        // Handles last slide
        if (end == lastSlide){
          $('#controls a.next').addClass('inactive');
        } else {
          $('#controls a.prev.inactive').removeClass('inactive');
        }

        //Handle pages
        $('#pagination li.active').removeClass('active').next().addClass('active');

      }
      // Prev
      else {

        slideSlides('right');

        // Handle active class
        $('li.slide.active').removeClass('active').prev().addClass('active')

        // Style controls
        // Handles first slide
        if (end == firstSlide){
          $('#controls a.prev').addClass('inactive');
        } else {
          $('#controls a.next.inactive').removeClass('inactive');
        }

        //Handle pages
        $('#pagination li.active').removeClass('active').prev().addClass('active');

      }

    });
  },

  'pagination' : function(){

    $('ul.slides li.slide').each(function(){

      $('ul#pagination').append('<li class=page></li>')

    });

    $('ul#pagination li:first-child').addClass('active');

    // Center it up
    var width = $('ul#pagination').width();
    $('ul#pagination').css('margin-left', '-' + width / 2 + 'px');
  }
};

$(document).ready(slideshow.init);
$(window).load(slideshow.init);
