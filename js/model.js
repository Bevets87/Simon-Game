(function (exports) {

  'use strict'

  function Model () {
    var self = this;

    self.on = false;
    self.started = false;
    self.strictMode = false;
    self.userTurn = false;
    self.speed = 1300;
    self.compPattern = [];
    self.userPattern = [];
    self.correctCount = 0;
    self.colors = ['red','green','yellow','blue'];
  }

  Model.prototype.setProps = function (props) {
    var self = this;
    for (var prop in props) {
      self[prop] = props[prop];
    }
    return self;
  }

  Model.prototype.reset = function () {
    var self = this;
    self = new Model();
    return self;
  }

  exports.app = exports.app || {};
  exports.app.Model = Model;
}(window))
