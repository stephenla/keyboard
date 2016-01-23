Main.KeyboardApp = function(keys) {
  this.initialize();
};

Main.KeyboardApp.prototype = {
  initialize: function() {
    this.controller = new Main.KeyboardController();
    this.listenTo(this.controller, "all", this.getEvent);
    $("body").append(this.controller.render().$el);
    this.controller.createKeyboard();
  },

  getEvent: function(event, args) {
    
    this[event](args);
  },
  addToLog: function(view, ch) {
    view.model.set('log', view.model.get('log') + ch);
  },
  addToPlayback: function() {

  },
  createKeyboard: function(view) {
    
    var keyboard = new Main.Keyboard({
      keys: ["c", "d", "e", "f", "g", "a", "b"],
      log: "",
      playback: ""
    });
    view.collection.add(keyboard);
  },
  createKey: function(view, letter) {
    var attributes = letter ? {
      letter: letter
    } : {};
    var key = new Main.Key(attributes);
    view.collection.add(key);
  }
};

_.extend(Main.KeyboardApp.prototype, Backbone.Events);

var app = new Main.KeyboardApp();