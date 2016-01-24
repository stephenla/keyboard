describe("KeyboardView", function () {
  var view;
  beforeEach(function () {
    view = new Main.KeyboardView();
  })

  describe("initialization", function() {
    it("should have a keyboard model", function () {
      expect(view.model instanceof Main.Keyboard).toBeTruthy();
    });
    it("should have a collection of keys", function () {
      expect(view.collection instanceof Main.Keys).toBeTruthy();
    });
  })
});