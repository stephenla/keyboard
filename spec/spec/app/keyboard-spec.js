describe("KeyboardApp", function() {
  var keyboardApp;
  beforeEach(function() {
    keyboardApp = new Main.KeyboardApp();
  });

  describe("initialization", function() {
    describe("listenTo", function() {
      it("should listen to KeyboardControllers", function () {
        spyOn(keyboardApp, "listenTo");
        keyboardApp.initialize();
        expect(keyboardApp.listenTo).toHaveBeenCalled();
      });
    });
  });
  describe("addToLog", function() {
    beforeEach(function() {
      spyOn(keyboardApp, 'addToLog');
      view = new Main.KeyboardController();
      keyboardApp.addToLog(view, "a");
    });
    it("should take a view and a string as arguments", function() {
      expect(keyboardApp.addToLog).toHaveBeenCalledWith(view, "a");
    });
    it("should add to the log string of the view", function() {
      expect(view.model.get("log")).toEqual("a");
    });
    it("should throw an exception if the string is longer than 1 character", function() {
      expect(function() {
        keyboardApp.addToLog(view,"abc");
      }).toThrowError("too many characters");
    });
  });  

  describe("addToPlayback", function() {
    beforeEach(function() {
      spyOn(keyboardApp, 'addToPlayback');
      view = new KeyboardController();
      keyboardApp.addToPlayback(view, "a");
    });
    it("should take a view and a string as arguments", function() {
      expect(keyboardApp.addToPlayback).toHaveBeenCalledWith(view, "a");
    });
    it("should add to the playback string of the view", function() {
      expect(view.model.get("playback")).toEqual("a");
    });
    it("should throw an exception if the string is longer than 1 character", function() {
      expect(function() {
        keyboardApp.addToPlayback(view,"abc");
      }).toThrow("too many characters");
    });
  });
});
