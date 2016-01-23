Main.Keyboard = Backbone.Model.extend({
  initialize: function() {
    this.set("log", "");
    this.set("playback", "");
  },
  validate: function(attrs, options) {
    
    if (attrs.playback && !attrs.playback.split(",").every(function(current, index) {
        return current.match(/[A-Za-z]{1}/);
      })) {
      console.log("invalid playback sequence");
      return "invalid playback sequence";
    }

    if (options.playback && !options.playback.split(",").every(function(current, index) {
        return current.match(/[A-Za-z]{1}/);
      })) {
      console.log("invalid playback sequence");
      return "invalid playback sequence";
    }
  }
});

Main.Keyboards = Backbone.Collection.extend({});
