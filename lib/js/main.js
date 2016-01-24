Backbone.CompositeView = Backbone.View.extend({
  addSubview: function (selector, subview, prepend) {
    if (prepend) {
      this.subviews(selector).unshift(subview);
    } else {
      this.subviews(selector).push(subview);
    }
    // Try to attach the subview. Render it as a convenience.
    this.attachSubview(selector, subview, prepend);
    subview.render();
  },

  attachSubview: function (selector, subview, prepend) {
    if (prepend) {
      this.$(selector).prepend(subview.$el);
    } else {
      this.$(selector).append(subview.$el);
    }
    // Bind events in case `subview` has previously been removed from
    // DOM.
    subview.delegateEvents();

    if (subview.attachSubviews) {
      subview.attachSubviews();
    }
  },

  attachSubviews: function () {
    // I decided I didn't want a function that renders ALL the
    // subviews together. Instead, I think:
    //
    // * The user of CompositeView should explicitly render the
    //   subview themself when they build the subview object.
    // * The subview should listenTo relevant events and re-render
    //   itself.
    //
    // All that is necessary is "attaching" the subview `$el`s to the
    // relevant points in the parent CompositeView.

    var view = this;
    this.subviews().each(function (selectorSubviews, selector) {
      view.$(selector).empty();
      selectorSubviews.each(function (subview) {
        view.attachSubview(selector, subview);
      });
    });
  },

  eachSubview: function(callback) {
    this.subviews().each(function (selectorSubviews, selector) {
      selectorSubviews.each(function (subview) {
        callback(subview, selector);
      });
    });
  },

  onRender: function() {
    this.eachSubview(function (subview) {
      subview.onRender && subview.onRender();
    });
  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    this.eachSubview(function (subview) {
      subview.remove();
    });
  },

  removeSubview: function (selector, subview) {
    subview.remove();

    var selectorSubviews = this.subviews(selector);
    selectorSubviews.splice(selectorSubviews.indexOf(subview), 1);
  },

  removeModelSubview: function (selector, model) {
    var selectorSubviews = this.subviews(selector);
    var i = selectorSubviews.findIndex(function (subview) {
      return subview.model === model;
    });
    if (i === -1) { return; }

    selectorSubviews.toArray()[i].remove();
    selectorSubviews.splice(i, 1);
  },

  subviews: function (selector) {
    // Map of selectors to subviews that live inside that selector.
    // Optionally pass a selector and I'll initialize/return an array
    // of subviews for the sel.
    this._subviews = this._subviews || {};

    if (selector) {
      this._subviews[selector] = this._subviews[selector] || _([]);
      return this._subviews[selector];
    } else {
      return _(this._subviews);
    }
  },

  unshiftSubview: function (selector, subview) {
    this.addSubview(selector, subview, true);
  }
});

if (typeof window.Main === "undefined") window.Main = {};
Main.KeyView = Backbone.View.extend({
  tagName: "li",

  template: _.template($("#key-template").html()),

  events: {
    "click .key": "clickKey",
    "mousedown .key": "mousedownKey",
    "mouseup .key": "mouseupKey",
    "mouseout .key": "mouseupKey"
  },

  initialize: function () {
    this.listenTo(this.model, "change", this.render);
  },

  clickKey: function () {
    this.trigger("clickKey", this.model.get("letter"));
  },

  mousedownKey: function () {
    this.$(".anchor").addClass("active");
  },
  mouseupKey: function () {
    this.$(".anchor").removeClass("active");
  },

  render: function () {
    // letter: "a"; key.get("letter")
    var content = this.template({ key: this.model });
    this.$el.html(content);
    return this;
  }

});

Main.KeyboardView = Backbone.CompositeView.extend({
  initialize: function() {
    this.model = this.model ? this.model : new Main.Keyboard({
      keys: ["c", "d", "e", "f", "g", "a", "b"],
      log: "",
      playback: ""
    });
    this.collection = new Main.Keys();
    this.listenTo(this.collection, "add", this.addKey);
    this.listenTo(this.collection, "remove", this.removeKeyboard);
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "invalid", this.invalidPlayback);

  },

  id: "p-wrapper",

  tagName: "div",

  template: _.template($("#keyboard-template").html()),

  events: {
    "click .play": "clickPlay"
  },

  addKey: function(model) {
    var subview = new Main.KeyView({
      model: model
    });
    this.listenTo(subview, "all", this.getEvent);
    this.addSubview(".keys", subview);
  },
  initializeKeys: function() {
    this.model.get("keys").forEach(function(key) {
      this.createKey(key);
    }.bind(this));
  },

  invalidPlayback: function(model) {
    this.$(".error").html(model.validationError);
  },

  createKey: function(key) {
    this.trigger("createKey", this, key);
  },

  getEvent: function(event) {
    this[event].apply(this, Array.prototype.slice.call(arguments, 1));
  },

  clickKey: function(letter) {
    this.trigger("clickKey", this, letter);
  },

  clickPlay: function(e) {
    this.trigger("playPlayback", this, this.$(".playback-input").val());
  },

  render: function() {
    // letter: "a"; keyboard.get("log")

    var content = this.template({
      keyboard: this.model
    });
    this.$el.html(content);
    this.attachSubviews();
    return this;
  }
});


Main.KeyboardController = Backbone.CompositeView.extend({
  initialize: function () {
    this.collection = new Main.Keyboards();
    this.listenTo(this.collection, "add", this.addKeyboard);
    this.listenTo(this.collection, "remove`", this.removeKeyboard);
  },

  template: _.template($("#keycontroller").html()),

  className: "keyboard-app",

  tagName: "section",

  events: {
    "click .add-keyboard" : "clickAddKeyboard"
  },

  getEvent: function (event) {
    this[event].apply(this, Array.prototype.slice.call(arguments, 1));
  },

  createKeyboard: function () {

    this.trigger("createKeyboard", this);
  },

  clickAddKeyboard: function () {
    $(".tooltip").remove();
    this.createKeyboard();
  },

  addKeyboard: function (model) {
    
    var subview = new Main.KeyboardView({ model: model });
    this.listenTo(subview, "all", this.getEvent);
    subview.initializeKeys();
    this.addSubview(".keyboards", subview);
  },

  createKey: function (view, key) {
    this.trigger("createKey", view, key);
  },

  clickKey: function (view, letter) {
    this.trigger("addToLog", view, letter);
  },

  playPlayback: function (view, playback) {
    this.trigger("playPlayback", view, playback);
  },

  render: function () {
    var content = this.template({});
    this.$el.html(content);
    this.attachSubviews();
    return this;
  }
});

Main.Key = Backbone.Model.extend({

});

Main.Keys = Backbone.Collection.extend({});
Main.Keyboard = Backbone.Model.extend({
  initialize: function() {
    this.set("log", "");
    this.set("playback", "");
    if (this.get("keys") === "")
      this.set({ "keys": ["c", "d", "e", "f", "g", "a", "b"] });
  },
  validate: function(attrs, options) {
    var seq = [];
    if ( attrs.playback && !attrs.playback.split(",").every(function(current, index) {
        if (this.get("keys").indexOf(current) === -1)
          seq.push(current)
        return (current.match(/^[A-Za-z]{1}$/)) && (this.get("keys").indexOf(current) >= 0);
      }.bind(this))) {
      return seq.length === 0 ? "invalid playback sequence" : "invalid character " + seq.join(",");
    }

    if (options.playback && !options.playback.split(",").every(function(current, index) {
      if (this.get("keys").indexOf(current) === -1)
          seq.push(current)
        return (current.match(/^[A-Za-z]{1}$/)) && (this.get("keys").indexOf(current) >= 0);
      }.bind(this))) {
      return seq.length === 0 ? "invalid playback sequence" : "invalid character: " + seq.join(",");
    }
  }
});

Main.Keyboards = Backbone.Collection.extend({});

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
    view.model.set('log', view.model.get('log') + letter);
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
      // this.intervalPlayback(views);
      this.promisePlayback(views);
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
  promisePlayback: function(views) {
    var that = this;
    views.reduce(function(sequence, view) {
      // Add these actions to the end of the sequence
      return sequence.then(function() {
        return that.getPlaybackPromise(view);
      });
    }, Promise.resolve());
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
