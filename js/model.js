(function (exports) {

  'use strict'

  function Model () {
    var self = this;

    self.state = {
      on: false,
      started: false,

      strictMode: false,

      simonSpeed: 1300,
      simonChain: new Iterator(new Array()),
      simonIntervalID: null,

      userChain: new Array(),
      userChoice: null,
      userTurn: false,

      correctCount: 0
    }
  }

  Model.prototype.setState = function (newState, cb) {
    var self = this;
    cb = cb || null;
    self.state = Object.assign(
      {},
      self.state,
      newState
    )
    if (cb) {
      cb(self.state)
    }
    return self.state;
  }

  exports.app = exports.app || {};
  exports.app.Model = Model;

})(window)
