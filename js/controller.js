(function (window) {

  'use strict'

  function Controller (model, view) {
    var self = this;

    self.model = model;
    self.view = view;

    self.view.bind('turnSimonOn', function () {
      self.model.setState({on: true}, function (state) {
        self.view.render('displayOnMode');
      });
    })

    self.view.bind('turnSimonOff', function () {
      self.model.setState({
        on: false,
        strictMode: false,
        playerTurn: false,
        speed: 1300,
        simonChoices: [],
        correctChoices: [],
        correctCount: 0,
        playerChoice: ''
      }, function (state) {
        self.view.render('displayOffMode');
        self.view.render('displayCount', {count: null});
        self.view.render('displayStrictOff');
      })
    })

    self.view.bind('toggleStrictMode', function () {
      if (self.model.state.on) {
        self.model.state.strictMode = self.model.state.strictMode ? false : true;
          self.model.setState({strictMode: self.model.state.strictMode}, function (state) {
          if (state.strictMode) {
            self.view.render('displayStrictOn');
          } else {
            self.view.render('displayStrictOff');
          }
        })
      }
    })

    self.view.bind('chooseColor', function (e) {
      if (self.model.state.playerTurn) {
        self.model.setState({playerChoice: e.target.id, playerTurn: false}, function (state) {
          self.isPlayerCorrect(state, function (response) {
            //If player gets last color in sequence right
              if (response.correct && response.state.correctChoices.length === state.simonChoices.length) {
                self.view.render('displayCount', {count: response.state.correctChoices.length});
                self.view.render('displayLightOn', {color: response.state.playerChoice});
                setTimeout(function () {
                  self.view.render('displayLightOff', {color: response.state.playerChoice});
                  //Simon adds new color to the sequence
                  response.state.simonChoices = self.getSimonChoices(response.state);

                  self.model.setState(response.state, function (state) {
                    self.playSimonChoices(state, function (simonChoice, count) {
                      //Let player go when simon has finished sequence
                      if (count === state.simonChoices.length - 1) {
                        self.model.setState({playerTurn: true}, function (state) {
                          self.view.render('displayLightOn', {color: simonChoice});
                          setTimeout(function () {
                            self.view.render('displayLightOff', {color: simonChoice});
                          }, 500)
                        })
                      }
                      //Continue going through sequence if it has not finished
                      else {
                        self.view.render('displayLightOn', {color: simonChoice});
                        setTimeout(function () {
                          self.view.render('displayLightOff', {color: simonChoice});
                        }, 500)
                      }
                    })
                  })
                }, 500)
              }
              //If player gets all colors in simon sequence except for the last one right
              else if (response.correct && response.state.correctChoices.length < state.simonChoices.length) {
                self.view.render('displayLightOn', {color: response.state.playerChoice});
                setTimeout(function () {
                  self.view.render('displayLightOff', {color: response.state.playerChoice});
                  //Player goes again
                  self.model.setState(response.state, function (state) {
                    state = self.model.state;
                  })
                }, 500)

              }
              //If player does not get color in simon sequence right in strict mode
              else if (response.state.strictMode && !response.correct) {
                self.view.render('displayErrorLightOn', {color: response.state.playerChoice});
                setTimeout(function () {
                  self.view.render('displayLightOff', {color: response.state.playerChoice});
                  self.view.render('displayCount',{count: response.state.correctChoices.length})
                  //Simon starts new sequence from beginning
                  response.state.simonChoices = self.getSimonChoices(response.state);
                  self.model.setState(response.state, function (state) {
                    self.playSimonChoices(state, function (simonChoice, count) {
                      //Let player go when simon has finished cycling
                      if (count === state.simonChoices.length - 1) {
                        self.model.setState({playerTurn: true}, function (state) {
                          self.view.render('displayLightOn', {color: simonChoice});
                          setTimeout(function () {
                            self.view.render('displayLightOff', {color: simonChoice});
                          }, 500)
                        })
                      }
                      //Continue cycling if sequence has not finished
                      else {
                        self.view.render('displayLightOn', {color: simonChoice});
                        setTimeout(function () {
                          self.view.render('displayLightOff', {color: simonChoice});
                        }, 500)
                      }
                    })
                  })
                }, 500)

              }
              //If player does not get color in simon sequence right in regular mode
              else {
                self.view.render('displayErrorLightOn', {color: response.state.playerChoice});
                setTimeout(function () {
                  self.view.render('displayLightOff', {color: response.state.playerChoice});
                  //Simon repeats last sequence
                  self.model.setState(response.state, function (state) {
                    self.playSimonChoices(state, function (simonChoice, count) {
                      //Let player go when simon has finished cycling
                      if (count === state.simonChoices.length - 1) {
                        self.model.setState({playerTurn: true}, function (state) {
                          self.view.render('displayLightOn', {color: simonChoice});
                          setTimeout(function () {
                            self.view.render('displayLightOff', {color: simonChoice});
                          }, 500)
                        })
                      }
                      //Continue cycling if sequence has not finished
                      else {
                        self.view.render('displayLightOn', {color: simonChoice});
                        setTimeout(function () {
                          self.view.render('displayLightOff', {color: simonChoice});
                        }, 500)
                      }
                    })
                  })
                })
              }
            })

        })
      }
    })

    self.view.bind('startGame', function () {
      if (self.model.state.on && self.model.state.simonChoices.length === 0) {
        self.view.render('displayCount', {count: self.model.state.correctChoices.length});
        self.model.setState({simonChoices: self.getSimonChoices(self.model.state)}, function (state) {
          self.playSimonChoices(state, function (simonChoice, count) {
            //Let player go when simon has finished cycling
            if (count === state.simonChoices.length - 1) {
              self.model.setState({playerTurn: true}, function (state) {
                self.view.render('displayLightOn', {color: simonChoice});
                setTimeout(function () {
                  self.view.render('displayLightOff', {color: simonChoice});
                }, 500)
              })
            }
            //Continue cycling if sequence has not finished
            else {
              self.view.render('displayLightOn', {color: simonChoice});
              setTimeout(function () {
                self.view.render('displayLightOff', {color: simonChoice});
              }, 500)
            }
          })
        })
      }
    })
  }

  Controller.prototype.getSimonChoices = function (state) {
    var newSimonChoices = state.simonChoices.slice();
    var colors = ['red','green','yellow','blue'];
    var randomIndex = Math.floor(Math.random() * colors.length);
    newSimonChoices.push(colors[randomIndex]);
    return newSimonChoices;
  }

  Controller.prototype.playSimonChoices = function (state, cb) {
    var self = this;
    var count = 0;
    if (state.correctChoices.length > 9) {
      state.speed = 700;
    }
    var start = setInterval(function () {
      if (self.model.state.on && self.model.state.correctChoices.length <= 19) {
        if (count === state.simonChoices.length - 1) {
          cb(state.simonChoices[count], count)
          clearInterval(start);
        } else {
          cb(state.simonChoices[count], count)
          count++;
        }
      } else if (self.model.state.on && self.model.state.correctChoices.length === 20) {
        self.resetGame();
        clearInterval(start);
      } else {
        clearInterval(start);
      }
    }.bind(self), state.speed)
  }

  Controller.prototype.isPlayerCorrect = function (state, cb) {
    var correct;
    if (state.playerChoice === state.simonChoices[state.correctCount] && state.correctCount === (state.simonChoices.length - 1)) {
      state.correctCount = 0;
      state.correctChoices.push(state.playerChoice);
      correct = true;
    }
    else if (state.playerChoice === state.simonChoices[state.correctCount] && state.correctCount < state.simonChoices.length) {
      state.correctCount++;
      state.playerTurn = true;
      correct = true;
    }
    else if (state.strictMode) {
      state.correctCount = 0;
      state.correctChoices = [];
      state.simonChoices = [];
      correct = false;
    }
    else {
      state.correctCount = 0;
      correct = false;
    }
    cb({state: state, correct: correct})
  }

  Controller.prototype.resetGame = function () {
    var self = this;
    self.model.setState({
      on: true,
      strictMode: false,
      playerTurn: false,
      speed: 1300,
      simonChoices: [],
      correctChoices: [],
      correctCount: 0,
      playerChoice: ''
    }, function (state) {
      self.view.render('displayWinnerTitle');
      self.view.render('displayCount', {count: 0})
      self.view.render('displayStrictOff');
      setTimeout(function () {
        self.view.render('hideWinnerTitle');
      }, 1000)
    })
  }


  window.app = window.app || {};
  window.app.Controller = Controller;
}(window))
