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

  getEvent: function(event) {

    this[event].apply(this, Array.prototype.slice.call(arguments, 1));
  },
  addToLog: function(view, letter) {
    view.model.set('log', view.model.get('log') + letter);
  },
  addToPlayback: function(view, playback) {
    playback = playback.split(",").map(function(letter) {
      return letter.trim().toLowerCase();
    });
    playback = playback.join(",");
    view.model.set({
      "playback": playback
    }, {
      validate: true
    });
    view.model.trigger("change", view.model);
    return playback;
  },
  playPlayback: function(view, playback) {
    playback = this.addToPlayback(view, playback);
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
    this.intervalPlayback(views);

  },

  intervalPlayback: function(views) {
    views.forEach(function (view, index) {
      window.setTimeout(function () {
        view.mousedownKey();
        window.setTimeout(function () {
          view.mouseupKey();
        }, 1000);
      }, index * 1000);
    });
  },

  getTrack: function(id, index) {
    return new Promise(function(resolve, reject) {
      R.request({
        method: "get",
        content: {
          keys: id,
        },
        success: function(response) {
          resolve([response, index]);

        },
        error: function(response) {
          reject(response);
        }
      });
    });
  },
  initPlayer: function() {
    Promise.all(
      rdio.covers.playlist.map(getTrack)
    ).then(function(responses) {
      responses.forEach(function(response) {
        addTrack(response[0], response[1]);
      });
    }).catch(function(err) {
      console.log(err);
    }).then(function() {
      window.setTimeout(function() {
        resizeCarousel();
        initEvents();
        resetZindex();
      }, 100);

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
