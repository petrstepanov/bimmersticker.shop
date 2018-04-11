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

    var filterCardsByTag = function(tag){
      // Fade out block with cards
      tag = tag.toLowerCase();
      if (tag == 'all'){
        window.demo.shuffle.filter(Shuffle.ALL_ITEMS); // or .filter()
      }
      else {
        window.demo.shuffle.filter(tag);
      }
      // $('.js--card-columns').animateCss('fadeOut', function() {
      //   // Remove cards that don't have the tag
      //   $.each($('.js--card-columns .card'), function(index, element){
      //     var tags = $(element).attr('data-card-tags');
      //     var hasTag = tags.includes(tag);
      //     hasTag ? $(element).show() : $(element).hide();
      //   });
      //   // Fade in block with cards
      //   $('.js--card-columns').animateCss('fadeIn');
      // });
    };

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
      },
      initShuffleStyleFilter: function(){
        var Shuffle = window.Shuffle;

        var Demo = function (element) {
          this.element = element;

          this.shuffle = new Shuffle(element, {
            itemSelector: '.card-col',
            sizer: element.querySelector('.my-sizer-element'),
          });

          // Log events.
          this.addShuffleEventListeners();

          this._activeFilters = [];

          // this.addFilterButtons();
          // this.addSorting();
          // this.addSearchFilter();

          this.mode = 'exclusive';
        };

        Demo.prototype.toggleMode = function () {
          if (this.mode === 'additive') {
            this.mode = 'exclusive';
          } else {
            this.mode = 'additive';
          }
        };

        /**
         * Shuffle uses the CustomEvent constructor to dispatch events. You can listen
         * for them like you normally would (with jQuery for example).
         */
        Demo.prototype.addShuffleEventListeners = function () {
          this.shuffle.on(Shuffle.EventType.LAYOUT, function (data) {
            console.log('layout. data:', data);
          });

          this.shuffle.on(Shuffle.EventType.REMOVED, function (data) {
            console.log('removed. data:', data);
          });
        };

        Demo.prototype.addFilterButtons = function () {
          var options = document.querySelector('.filter-options');

          if (!options) {
            return;
          }

          var filterButtons = Array.from(options.children);

          filterButtons.forEach(function (button) {
            button.addEventListener('click', this._handleFilterClick.bind(this), false);
          }, this);
        };

        Demo.prototype._handleFilterClick = function (evt) {
          var btn = evt.currentTarget;
          var isActive = btn.classList.contains('active');
          var btnGroup = btn.getAttribute('data-group');

          // You don't need _both_ of these modes. This is only for the demo.

          // For this custom 'additive' mode in the demo, clicking on filter buttons
          // doesn't remove any other filters.
          if (this.mode === 'additive') {
            // If this button is already active, remove it from the list of filters.
            if (isActive) {
              this._activeFilters.splice(this._activeFilters.indexOf(btnGroup));
            } else {
              this._activeFilters.push(btnGroup);
            }

            btn.classList.toggle('active');

            // Filter elements
            this.shuffle.filter(this._activeFilters);

          // 'exclusive' mode lets only one filter button be active at a time.
          } else {
            this._removeActiveClassFromChildren(btn.parentNode);

            var filterGroup;
            if (isActive) {
              btn.classList.remove('active');
              filterGroup = Shuffle.ALL_ITEMS;
            } else {
              btn.classList.add('active');
              filterGroup = btnGroup;
            }

            this.shuffle.filter(filterGroup);
          }
        };

        Demo.prototype._removeActiveClassFromChildren = function (parent) {
          var children = parent.children;
          for (var i = children.length - 1; i >= 0; i--) {
            children[i].classList.remove('active');
          }
        };

        Demo.prototype.addSorting = function () {
          var buttonGroup = document.querySelector('.sort-options');

          if (!buttonGroup) {
            return;
          }

          buttonGroup.addEventListener('change', this._handleSortChange.bind(this));
        };

        Demo.prototype._handleSortChange = function (evt) {
          // Add and remove `active` class from buttons.
          var wrapper = evt.currentTarget;
          var buttons = Array.from(evt.currentTarget.children);
          buttons.forEach(function (button) {
            if (button.querySelector('input').value === evt.target.value) {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          });

          // Create the sort options to give to Shuffle.
          var value = evt.target.value;
          var options = {};

          function sortByDate(element) {
            return element.getAttribute('data-created');
          }

          function sortByTitle(element) {
            return element.getAttribute('data-title').toLowerCase();
          }

          if (value === 'date-created') {
            options = {
              reverse: true,
              by: sortByDate,
            };
          } else if (value === 'title') {
            options = {
              by: sortByTitle,
            };
          }

          this.shuffle.sort(options);
        };

        // Advanced filtering
        Demo.prototype.addSearchFilter = function () {
          var searchInput = document.querySelector('.js-shuffle-search');

          if (!searchInput) {
            return;
          }

          searchInput.addEventListener('keyup', this._handleSearchKeyup.bind(this));
        };

        /**
         * Filter the shuffle instance by items with a title that matches the search input.
         * @param {Event} evt Event object.
         */
        Demo.prototype._handleSearchKeyup = function (evt) {
          var searchText = evt.target.value.toLowerCase();

          this.shuffle.filter(function (element, shuffle) {

            // If there is a current filter applied, ignore elements that don't match it.
            if (shuffle.group !== Shuffle.ALL_ITEMS) {
              // Get the item's groups.
              var groups = JSON.parse(element.getAttribute('data-groups'));
              var isElementInCurrentGroup = groups.indexOf(shuffle.group) !== -1;

              // Only search elements in the current group
              if (!isElementInCurrentGroup) {
                return false;
              }
            }

            var titleElement = element.querySelector('.picture-item__title');
            var titleText = titleElement.textContent.toLowerCase().trim();

            return titleText.indexOf(searchText) !== -1;
          });
        };

        // document.addEventListener('DOMContentLoaded', function () {
          window.demo = new Demo(document.getElementById('grid'));
        // });
      },
      initCardsFilter: function(){
        $('.js--filter-toolbar .btn').click(function(){
          if (!$(this).hasClass('active')){
            // `Toggle` visual functionality
            $('.js--filter-toolbar .btn.active').removeClass('active').removeClass('btn-primary').addClass('btn-link');
            $(this).addClass('active').addClass('btn-primary').removeClass('btn-link');
            var tag = $(this).html();
            // Actual filtering
            filterCardsByTag(tag);
          }
        });
      },
      initOnLoadFilter: function(){
        var hash = location.hash.slice();
        if (hash.slice(1) == "") return 0;
        var $button = $(".js--filter-toolbar .btn:contains('" + hash.substring(1) + "')");
        if ($button) $button.click();
      }
    };
  }
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
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname
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
          var newHref = 'mailto:' + contactEmail + '?subject=' + subject + '&body=' + message;
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
        // if (hash.slice(1) == "") return 0;
        // // if hashtag is "#modal-..." show modal
        // if (hash.includes("modal")){
        //   var hashSubstrings = hash.split("-");
        //   var modalName = hashSubstrings[1];
        //   $('#'+modalName+'Modal').modal();
        //   return 0;
        // }
        //
        // // otherwise do smooth scroll to the anchor
        // var target = $(hash);
        // target = target.length ? target : $('[name=' + hash.slice(1) + ']');
        // if (target.length){
        //   $('html, body').animate({
        //     scrollTop: target.offset().top - 32
        //   }, 600, callback);
        // }
      },
      initHashChange: function() {
        // var that = this;
        // // Prevent default action on local links with href="#..."
        // $('[href^="#"]').click(function(event){
        //   event.preventDefault();
        //   window.location.hash = $(this).attr('href');
        // });
        // $(window).on('hashchange',function(){
        //   var hash = location.hash.slice();
        //   that.handleHashChange(hash);
        // });
        // var hash = location.hash.slice();
        // this.handleHashChange(hash);
        // // Remove modal hashtag on close
        // $("[id~='Modal']").on('hidden.bs.modal', function (e) {
        //   window.location.hash = '';
        // });
      },
      initAnimateCss: function() {
        $.fn.extend({
          animateCss: function(animationName, callback) {
            var animationEnd = (function(el) {
              var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
              };
              for (var t in animations) {
                if (el.style[t] !== undefined) {
                  return animations[t];
                }
              }
            })(document.createElement('div'));
            this.addClass('animated ' + animationName).one(animationEnd, function() {
              $(this).removeClass('animated ' + animationName);

              if (typeof callback === 'function') callback();
            });
            return this;
          },
        });
      }
    };
  }
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
  // Smooth link scrolling
  myHtmlHelper.initSmoothLinkScrolling();
  // Init contact form behaviour
  myHtmlHelper.initContactForm();
  // Init animateCss usage
  myHtmlHelper.initAnimateCss();

  // Coming soon cards logic
  var myCardsManipulator = cardsManipulator.getInstance();
  myCardsManipulator.initComingSoonCards();
  myCardsManipulator.initShuffleStyleFilter();
  myCardsManipulator.initCardsFilter();
  // Check if special bmw mode was selected from adwords
  myCardsManipulator.initOnLoadFilter();

  // iOS10 prevent pinch zoom
  document.addEventListener('gesturestart', function (event) {
    event.preventDefault();
  });

  // Bootstrap tooltips
  $('[data-toggle="tooltip"]').tooltip()
});
