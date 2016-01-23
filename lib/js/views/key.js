if (typeof window.Main === "undefined") window.Main = {};
Main.KeyView = Backbone.View.extend({
  
  render: function () {
    // letter: "a"; key.get("letter")
    var content = this.template({ key: this.model });
    this.$el.html(content);
    return this;
  }

});
