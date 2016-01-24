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
