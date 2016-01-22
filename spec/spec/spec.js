describe("keyboardApp", function() {
  var keyboardApp;
  beforeEach(function() {
    keyboardApp = new Main.KeyboardApp();
  });

  describe("initialization", function() {
    describe("initialize an array of keyboards", function() {
      it("should initialize an Array of KeyboardControllers of size 1", function() {
        expect(Array.isArray(keyboardApp.keyboards)).toBeTruthy();
        expect(keyboardApp.keyboards.length).toEqual(1);
        expect(keyboardApp.keyboards[0] instanceof Main.KeyboardController).toBeTruthy();
      });
    });

    describe("listenTo", function() {
      it("should listen to KeyboardControllers", function () {
        spyOn(keyboardApp, "listenTo");
        keyboardApp.addKeyboard();
        expect(keyboardApp.listenTo).toHaveBeenCalled();
      });
    });
  });

  describe("addToLog", function() {
    beforeEach(function() {
      spyOn(keyboardApp, 'addToLog');
      var view = new Main.KeyboardController();
      var ch = "a"
      keyboardApp.addToLog(view, ch);
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
      var view = new KeyboardController();
      var ch = "a";
      keyboardApp.addToPlayback(view, ch);
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
      }).toThrowError("too many characters");
    });
  });
});

