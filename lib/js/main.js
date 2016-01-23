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
  
  render: function () {
    // letter: "a"; key.get("letter")
    var content = this.template({ key: this.model });
    this.$el.html(content);
    return this;
  }

});

Main.KeyboardView = Backbone.CompositeView.extend({
  initialize: function() {
    this.collection = new Main.Keys();
    this.listenTo(this.collection, "add", this.addKey);
    this.listenTo(this.collection, "remove`", this.removeKeyboard);
    this.model.get("keys").forEach(function(key) {
      this.createKey(key);
    }.bind(this));
  },

  id: "p-wrapper",

  tagName: "div",

  addKey: function(model) {
    var subview = new Main.KeyView({
      model: model
    });
    this.listenTo(subview, "all", getEvent);
    this.addSubview(".keys", subview);
  },

  createKey: function(key) {
    this.trigger("createKey", this, key);
  },

  getEvent: function(event, args) {
    this[event](args);
  },

  render: function() {
    // letter: "a"; keyboard.get("log")
    var content = this.template({ keyboard: this.model });
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
    window.setTimeout(function() {
      this.createKeyboard();
    }.bind(this),0);
  },

  template: _.template($("#keycontroller").html()),

  className: "keyboards",

  tagName: "section",

  events: {
    "click .key" : "clickKey"
  },

  createKeyboard: function () {

    this.trigger("createKeyboard", this);
  },

  addKeyboard: function (model) {
    
    var subview = new Main.KeyboardView({ model: model });
    this.listenTo(subview, "all", getEvent);
    this.addSubview(".keyboards", subview);
  },

  createKey: function (view, key) {
    this.trigger("createKey", view, key);
  },

  clickKey: function (e) {
    this.trigger("addToLog", this, e.currentTarget.innerHtml);
  },
  getEvent: function (event, args) {
    this[event](args);
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
  initialize: function () {
    this.set("log", "");
    this.set("playback", "");
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