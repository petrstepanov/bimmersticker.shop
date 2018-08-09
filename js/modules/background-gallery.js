var BackgroundGallery = function() {
  var DOM = {};
  var counter = 0;
  var imageSrcs = [];
  var interval = 2000;

  function _cacheDom(element) {
    if (element) DOM.$el = $(element);
    DOM.$images = DOM.$el.find("img");
  }

  function _renderBackground() {
    var n = DOM.$images.length;
    DOM.el.css({
      backgroundImage: "url(" + DOM.$images[++counter % n].src + ")"
    });
  }

  function _render() {
    _renderBackground();
    setInterval(_renderBackground, 2000);
  }

  function init(element) {
    if (element) {
      _cacheDom(element);
      _render();
    }
  }

  return {
    init: init
  };
};
