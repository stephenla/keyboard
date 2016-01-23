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
