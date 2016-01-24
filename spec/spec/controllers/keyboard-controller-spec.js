describe("KeyboardController", function() {
  var controller;
  beforeEach(function() {
    controller = new Main.KeyboardController();
  });

  describe("initialization", function() {
    it("should initialize a collection of Keyboards", function() {
      expect(controller.collection instanceof Main.Keyboards).toBeTruthy();
    });

    it("should listen to keyboard collection", function() {
      spyOn(controller, 'listenTo');
      controller.listenTo(controller.collection, "add", controller.addKeyboard);
      expect(controller.listenTo).toHaveBeenCalledWith(controller.collection, "add", controller.addKeyboard);
    })
  });

});
