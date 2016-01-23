describe("KeyboardController", function() {
  var controller;
  beforeEach(function() {
    controller = new Main.KeyboardController();
  });
  
  describe("initialization", function() {
    it("should initialize a collection of Keyboards", function() {
      expect(controller.collection instanceof Main.Keyboards).toBeTruthy();
    });

    describe("adding keyboard to collection", function () {
      it("should add a keyboard subview", function () {

        controller.addKeyboard();
        expect(controller.subviews().values()[0].first() instanceof Main.KeyboardView).toBeTruthy();
      })
    });
  });

});
