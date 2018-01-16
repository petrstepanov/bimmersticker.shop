var cardsManipulator = (function () {
  var instance;
  function init() {
    // Private methods and variables
    // function privateMethod(){
    //     console.log( "I am private" );
    // }
    var comingSoonLinkText = "Soon on eBay";
    var comingSoonLinkIcon = "<span class='icon-external'></span>";
    var comingSoonBadgeHtml = "<img class='card-img-soon' src='img/coming-soon.svg' alt='coming soon'>";

    return {
      // Public methods and variables
      initComingSoonCards: function () {
        $('.card-bimmersticker.coming-soon').each(function(){
          // Create and attach the 'Coming Soon' badge
          $(this).find('.card-img-top').after(comingSoonBadgeHtml);
          // Make button disabled
          $(this).find('.card-body a.btn').addClass('disabled');
          // Change Button text to 'Soon...'
          $(this).find('.card-body a.btn').html(comingSoonLinkIcon + ' ' + comingSoonLinkText);
        });
      }
    };
  };
  return {
    getInstance: function () {
      if ( !instance ) {
        instance = init();
      }
      return instance;
    }
  };
})();

var htmlHelper = (function () {
  var instance;
  function init() {
    // Private methods and variables
    // function privateMethod(){
    //     console.log( "I am private" );
    // }
    var slow = 600;
    var normal = 400;
    var fast = 200;
    return {
      // Public methods and variables
      initSmoothLinkScrolling: function () {
        $('a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function(event) {
          // On-page links
          if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
            &&
            location.hostname == this.hostname
          ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
              // Only prevent default if animation is actually gonna happen
              event.preventDefault();
              $('html, body').animate({
                scrollTop: target.offset().top
              }, slow, function() {
                // Callback after animation
                // Must change focus!
                // var $target = $(target);
                // $target.focus();
                // if ($target.is(":focus")) { // Checking if the target was focused
                //   return false;
                // } else {
                //   $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                //   $target.focus(); // Set focus again
                // };
              });
            }
          }
        });
      }
    };
  };
  return {
    getInstance: function () {
      if ( !instance ) {
        instance = init();
      }
      return instance;
    }
  };
})();

$(document).ready(function(){
  // Smooth link scrolling
  var myHtmlHelper = htmlHelper.getInstance();
  myHtmlHelper.initSmoothLinkScrolling();

  // Coming soon cards logic
  var myCardsManipulator = cardsManipulator.getInstance();
  myCardsManipulator.initComingSoonCards();
});
