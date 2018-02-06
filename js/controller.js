(function (exports) {

  'use strict'

  function Controller (model, view) {
    var self = this;

    self.model = model;
    self.view = view;

    self.view.bind('turnSimonOn', function () {
      self.set('simonOn')
    })

    self.view.bind('turnSimonOff', function () {
      self.set('simonOff', self.model.state)
    })

    self.view.bind('toggleStrictMode', function () {
      self.set('strictMode', self.model.state)
    })

    self.view.bind('startSimon', function () {
      self._handleStartSimon(self.model.state)
    })

    self.view.bind('chooseColor', function (color) {
      if ( self.model.state.userTurn ) {
        self._isCorrect({...self.model.state, color })
      }
    })

    self.view.bind('playAgain', function () {
      self._handleStartSimon(self.model.state)
    })

  }

  /* Command Pattern to abstract away Controller updates to the Model that render a new View */
  Controller.prototype.set = function (command, payload) {
    var self = this;
    var stateCommands = {
      'simonOn': function () {
        return self.model.setState({on: true}, function () {
          self.view.render('onMode')
        })
      },
      'simonOff': function () {
        var { simonIntervalID } = payload; clearInterval(simonIntervalID);
        return self.model.setState({
          on: false, started: false, strictMode: false, simonIntervalID: null,
          simonSpeed: 1300, simonChain: new Iterator(new Array()),
          userChain: new Array(), userChoice: null, userTurn: false, correctCount: 0
        }, function () {
          self.view.render('offMode')
        })
      },
      'strictMode': function () {
        var { on, strictMode } = payload;
        return self.model.setState({
          strictMode: on ? !strictMode : false
        }, function ({ strictMode }) {
          self.view.render(strictMode ? 'strictLightOn' : 'strictLightOff')
        })
      },
      'count': function () {
        var { correctCount } = payload;
        return self.model.setState({
          correctCount: correctCount
        }, function ({ correctCount }) {
          self.view.render('count', { correctCount: correctCount })
        })
      },
      'correct': function () {
        var { userChoice, userChain } = payload;
        return self.model.setState({
          userChain: [...userChain, userChoice ],
          userChoice: null, userTurn: true
        }, function () {
          self.view.render('color', {color: userChoice})
        })
      },
      'incorrect': function () {
        var { userChoice, strictMode, correctCount } = payload;
        return self.model.setState({
          userChain: [], userChoice: null,
          userTurn: false, correctCount: strictMode ? 0 : correctCount
        }, function ({ correctCount }) {
          self.view.render('color', { color: userChoice })
          self.view.render('incorrect', { correctCount: correctCount })
        })
      },
      'simonSequence': function () {
        var { simonChain, simonSpeed } = payload,
        next, userTurn, handler = setInterval(function () {
          if (simonChain.hasNext()) {
            next = simonChain.next(); userTurn = false;
          } else {
            simonChain.reset(); clearInterval(handler);
            handler = null; next = null; userTurn = true;
          }
          self.model.setState({
            simonIntervalID: handler,
            simonChain, userTurn
          }, function () {
            self.view.render('color', {color: next})
          })
        }, simonSpeed)
      },
      'winner': function () {
        return self.model.setState({
          simonSpeed: 1300, simonChain: new Iterator(new Array()),
          simonIntervalID: null, userChain: new Array(), userTurn: false,
          correctCount: 0, started: false, userChoice: null
        }, function () {
          self.view.render('winnerModal')
        })
      }
    }
    return stateCommands[command]()
  }

  Controller.prototype._handleStartSimon = function ({ on, started }) {
    var self = this;
    if (on && !started) {
      self.model.setState({ started: true }, function ({ correctCount, simonChain}) {
        self.view.render('hideWinnerModal')
        self.set('count', { correctCount: correctCount })
        self.set('simonSequence', self._addToSimonChain({ simonChain }))
      })
    }
  }

  Controller.prototype._addToSimonChain = function ({ simonChain }) {
    var self = this;
    return self.model.setState({
      simonChain: new Iterator([...simonChain.collection, getRandomSimonColor()])
    })
  }

  Controller.prototype._resetSimonChain = function ({ simonChain, strictMode }) {
    var self = this;
    if ( strictMode ) {
      simonChain.strictReset()
      return self._addToSimonChain({ simonChain })
    } else {
      simonChain.reset()
      return self.model.setState({ simonChain })
    }
  }

  Controller.prototype._adjustSpeed = function ({ correctCount, simonSpeed }) {
    var self = this;
    if (correctCount === 5) {
      simonSpeed = 900;
    }
    else if (correctCount === 10) {
      simonSpeed = 600;
    }
    else {
      simonSpeed = simonSpeed;
    }
    return self.model.setState({ simonSpeed })

  }

  Controller.prototype._isCorrect = function ({ simonChain, color, strictMode, correctCount }) {
    var self = this, next = simonChain.next();
    if (color === next) {
      self._isFinished(self.set('correct', self.model.setState({ simonChain, userChoice: color })))
    } else {
      self.set('simonSequence', self._resetSimonChain(self.set('incorrect', { userChoice: color, strictMode, correctCount })))
    }
  }

  Controller.prototype._isFinished = function ({ correctCount, simonChain }) {
    var self = this;
    if (!simonChain.hasNext()) {
      self.model.setState({ userTurn: false })
      self._isWinner(self._adjustSpeed(self.set('count', { correctCount: ++correctCount })))
    }
  }

  Controller.prototype._isWinner = function ({ correctCount, simonChain }) {
    var self = this;
    if (correctCount === 15) {
      self.set('winner')
    } else {
      self.set('simonSequence', self._addToSimonChain({ simonChain }))
    }
  }


  exports.app = exports.app || {};
  exports.app.Controller = Controller;
})(window)
