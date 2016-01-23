Main.KeyboardView = Backbone.CompositeView.extend({
  initialize: function() {
    this.collection = new Main.Keys();
    this.listenTo(this.collection, "add", this.addKey);
    this.listenTo(this.collection, "remove", this.removeKeyboard);
    this.listenTo(this.model, "change", this.render);
  },

  id: "p-wrapper",

  tagName: "div",

  template: _.template($("#keyboard-template").html()),

  events: {
    "click .play" : "clickPlay"
  },

  addKey: function(model) {
    var subview = new Main.KeyView({
      model: model
    });
    this.listenTo(subview, "all", this.getEvent);
    this.addSubview(".keys", subview);
  },
  initializeKeys: function () {
    this.model.get("keys").forEach(function(key) {
      this.createKey(key);
    }.bind(this));
  },

  createKey: function(key) {
    this.trigger("createKey", this, key);
  },

  getEvent: function (event) {
    this[event].apply(this, Array.prototype.slice.call(arguments, 1));
  },

  clickKey: function (letter) {
    this.trigger("clickKey", this, letter);
  },

  clickPlay: function (e) {
    this.trigger("playPlayback", this, this.$(".playback-input").val());
  },

  render: function() {
    // letter: "a"; keyboard.get("log")
    
    var content = this.template({ keyboard: this.model });
    this.$el.html(content);
    this.attachSubviews();
    return this;
  }
});
