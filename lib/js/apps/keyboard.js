$(function () {
  if (typeof window.Main === "undefined") window.Main = {}

  Main.KeyboardApp = function () {
    this.keyboards = [];
    this.initialize();
  };
  Main.KeyboardApp.prototype = {
    initialize: function () {
      this.addKeyboard();
    },
    addKeyboard: function () {
      var controller = new Main.KeyboardController()
      this.keyboards.push(controller);
      this.listenTo(controller, "all", this.getEvent);
    },
    getEvent: function () {
      
    }

  }
  _.extend(Main.KeyboardApp.prototype, Backbone.Events);
});