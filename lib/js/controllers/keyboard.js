
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
