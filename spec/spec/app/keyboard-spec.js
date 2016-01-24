describe("KeyboardApp", function() {
  var keyboardApp;
  beforeEach(function() {
    keyboardApp = new Main.KeyboardApp();
  });

  describe("initialization", function() {
    describe("listenTo", function() {
      it("should listen to KeyboardControllers", function() {
        spyOn(keyboardApp, "listenTo");
        keyboardApp.initialize();
        expect(keyboardApp.listenTo).toHaveBeenCalled();
      });
    });
  });
  describe("addToLog", function() {
    beforeEach(function() {
      spyOn(keyboardApp, 'addToLog').and.callThrough();
      var model = new Main.Keyboard({
        keys: ["c", "d", "e", "f", "g", "a", "b"],
        log: "",
        playback: ""
      });
      view = new Main.KeyboardView({
        model: model
      });
      keyboardApp.addToLog(view, "a");
    });
    it("should take a view and a string as arguments", function() {
      expect(keyboardApp.addToLog).toHaveBeenCalledWith(view, "a");
    });
    it("should add to the log string of the view", function() {
      expect(view.model.get("log")).toEqual("a");
    });
  });

  describe("addToPlayback", function() {
    beforeEach(function() {
      spyOn(keyboardApp, 'addToPlayback').and.callThrough();
      var model = new Main.Keyboard({
        keys: ["c", "d", "e", "f", "g", "a", "b"],
        log: "",
        playback: ""
      });
      view = new Main.KeyboardView({
        model: model
      });

      keyboardApp.addToPlayback(view, "a,b,e");
    });
    it("should take a view and a string as arguments", function() {
      expect(keyboardApp.addToPlayback).toHaveBeenCalledWith(view, "a,b,e");
    });
    it("should add to the playback string of the view", function() {
      expect(view.model.get("playback")).toEqual("a,b,e");
    });

  });
});
