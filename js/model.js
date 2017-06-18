(function (window) {

  'use strict'

  function Model () {
    this.state = {
      on: false,
      strictMode: false,
      playerTurn: false,
      speed: 1300,
      simonChoices: [],
      correctChoices: [],
      correctCount: 0,
      playerChoice: ''
    }
  }



  Model.prototype.setState = function (state, cb) {
    var self = this;
    self.state = Object.assign(
      {},
      self.state,
      state
    )
    cb(self.state);
  }



  window.app = window.app || {};
  window.app.Model = Model;
}(window))
