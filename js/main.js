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
      smoothScrollToLink: function($target){
        $('html, body').animate({
          scrollTop: $target.offset().top - 30
        }, slow);
      },
      showDialog: function($target){
        $target.modal('show');
      },
      initSmoothLinkScrolling: function(){
        var that = this;
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
            // Figure out element to scroll to. First try links on the same page
            event.preventDefault();
            var $target = $('a[name=' + this.hash.slice(1) + ']');
            if ($target.length){
              that.smoothScrollToLink($target);
              return 0;
            }
            $target = $('.modal' + this.hash);
            if ($target.length){
              that.showDialog($target);
            }
          }
        });
      },
      // Public methods and variables
      initContactForm: function() {
        var contactEmail = "info@bimmersticker.store";
        $('#inputSubject, #textareaMessage').change(function(){
          var subject = $('#inputSubject').val();
          var message = $('#textareaMessage').val();
          var newHref = 'mailto:' + contactEmail + '?subject=' + subject + '&body=' + message
          $('#submitLink').attr('href', newHref);
        });
        //   var message = $('#textareaMessage').val();
        $("#bimmerstickContactForm").submit(function( event ) {
          event.preventDefault();
          $('#submitLink').click();
        //   var subject = $('#inputSubject').val();
        //   var message = $('#textareaMessage').val();
        //   var wnd = window.open('mailto:'+contactEmail+'?subject='+subject+'&body='+message);
        //   setTimeout(function() {wnd.close();}, 200);
        });
      },
      handleHashChange: function(hash, callback) {
        if (hash.slice(1) == "") return 0;
        // if hashtag is "#modal-..." show modal
        if (hash.includes("modal")){
          var hashSubstrings = hash.split("-");
          var modalName = hashSubstrings[1];
          $('#'+modalName+'Modal')
        }
        // otherwise do smooth scroll to the anchor
        else {
          var target = $(hash);
          target = target.length ? target : $('[name=' + hash.slice(1) + ']');
          if (target.length){
            $('html, body').animate({
              scrollTop: target.offset().top - 32
            }, 600, callback);
          }
        }
      },
      initHashChange: function() {
        var that = this;
        // Prevent default action on local links with href="#..."
        $('[href^="#"]').click(function(event){
          event.preventDefault();
          window.location.hash = $(this).attr('href');
        });
        $(window).on('hashchange',function(){
          var hash = location.hash.slice();
          that.handleHashChange(hash);
        });
        var hash = location.hash.slice();
        this.handleHashChange(hash);
        // Remove modal hashtag on close
        $("[id~='Modal']").on('hidden.bs.modal', function (e) {
          window.location.hash = '';
        })
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
  var myHtmlHelper = htmlHelper.getInstance();

  // When loaded first check if modal with certain hash exists and show that modal
  // var hash = location.hash.slice();
  // myHtmlHelper.initHashChange(hash);
  // Smooth link scrolling
  myHtmlHelper.initSmoothLinkScrolling();

  // Init contact form behaviour
  myHtmlHelper.initContactForm();

  // Coming soon cards logic
  var myCardsManipulator = cardsManipulator.getInstance();
  myCardsManipulator.initComingSoonCards();

  // iOS10 prevent pinch zoom
  document.addEventListener('gesturestart', function (event) {
    event.preventDefault();
  });
});
