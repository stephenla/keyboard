Main.Keyboard = Backbone.Model.extend({
  initialize: function () {
    this.set("log", "");
    this.set("playback", "");
  }
});

Main.Keyboards = Backbone.Collection.extend({});