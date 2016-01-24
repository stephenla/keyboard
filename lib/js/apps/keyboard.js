Main.KeyboardApp = function(keys) {
  this.initialize();
};

Main.KeyboardApp.prototype = {
  initialize: function() {
    this.controller = new Main.KeyboardController();
    this.listenTo(this.controller, "all", this.getEvent);
    $(".app").append(this.controller.render().$el);
    this.controller.createKeyboard();
  },

  getEvent: function(event) {

    this[event].apply(this, Array.prototype.slice.call(arguments, 1));
  },
  addToLog: function(view, letter) {
    if (view.model.get('log') === "") {
      view.model.set('log', letter);
    } else {
      view.model.set('log', view.model.get('log') + "," + letter);
    }
  },
  addToPlayback: function(view, playback) {
    playback = playback.split(",").map(function(letter) {
      return letter.trim().toLowerCase();
    });
    playback = playback.join(",");
    view.model.set({
      "playback": playback
    });
    return view.model.isValid();
  },
  playPlayback: function(view, playback) {        
    if (this.addToPlayback(view, playback)) {

      var keyViews = view.subviews().values()[0].values();
      playback = playback.split(",");
      var views = [];
      for (var i = 0; i < playback.length; i++) {
        for (var j = 0; j < keyViews.length; j++) {
          if (keyViews[j].model.get("letter").toLowerCase() === playback[i].toLowerCase()) {
            // or keep a map of letter to keyview
            views.push(keyViews[j]);
            break;
          }
        }
      }
      this.promisePlayback(view, views);
    } else {
      view.model.trigger("invalid", view.model);
    }
  },

  getPlaybackPromise: function(view) {
    return new Promise(function(resolve, reject) {
      view.mousedownKey();
      window.setTimeout(function() {
        view.mouseupKey();
        window.setTimeout(function() {
          resolve();
        }, 100);
      }, 1000);
    });
  },
  promisePlayback: function(view, views) {
    view.undelegateEvents();
    var that = this;
    views.reduce(function(sequence, view) {
      return sequence.then(function() {
        return that.getPlaybackPromise(view);
      });
    }, Promise.resolve()).then(function () {
      view.delegateEvents();
    });
  },
  intervalPlayback: function(views) {
    views.forEach(function(view, index) {
      window.setTimeout(function() {
        view.mousedownKey();
        window.setTimeout(function() {
          view.mouseupKey();
        }, 1000);
      }, index * 1000);
    });
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
  },
  getLog: function(index) {
    return this.controller.collection.at(index).get("log");
  },
  getPlayback: function(index) {

    return this.controller.collection.at(index).get("playback");
  }
};

_.extend(Main.KeyboardApp.prototype, Backbone.Events);

var app = new Main.KeyboardApp();
