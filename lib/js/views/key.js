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
    var content = this.template({ key: this.model });
    this.$el.html(content);
    return this;
  }

});
