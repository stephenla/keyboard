
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
