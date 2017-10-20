(function (exports) {

  'use strict'

  function Controller (model, view) {
    var self = this;

    self.model = model;
    self.view = view;

    /**HELPER FUNCTIONS**/
    var {
      cyclePattern,
      getRandomColor,
      patternsMatch,
      patternIsComplete,
      resetPattern,
      addToPattern,
      isWinner
    } = self;


    /**TURN ON**/
    self.view.bind('turnSimonOn', function () {
      /*MODEL ACTIONS*/
      self.model.setProps({
        'on': true
      });
      /*VIEW ACTIONS*/
      self.view.render(
        'displayOnMode'
      );
    })

    /**TURN OFF**/
    self.view.bind('turnSimonOff', function () {
      /*MODEL ACTIONS*/
      self.model = self.model.reset();
      /*VIEW ACTIONS*/
      self.view.render(
        'displayOffMode'
      );
      self.view.render(
        'displayCount', {count: null}
      );
      self.view.render(
        'displayStrictOff'
      );
    })

    /**TOGGLE STRICT**/
    self.view.bind('toggleStrictMode', function () {
      if (self.model.on) {
        /*MODEL ACTIONS*/
        self.model.setProps({
          'strictMode': self.model.strictMode ? false : true
        });
        /*VIEW ACTIONS*/
        self.view.render(
          self.model.strictMode ? 'displayStrictOn' : 'displayStrictOff'
        );
      }
    })

    /**START GAME**/
    self.view.bind('startSimon', function () {
      if (self.model.on && !self.model.started) {
        /*MODEL ACTIONS*/
        self.model.setProps({
          'compPattern': addToPattern(getRandomColor(self.model.colors), self.model.compPattern),
          'started': true
        });
        /*VIEW ACTIONS*/
        self.view.render(
          'displayCount', {count: self.model.correctCount}
        );
        cyclePattern(
          self.model.speed,
          function (cycle, interval) {
            /*VIEW ACTIONS*/
            self.view.render(
              'displayLightOn',{color: self.model.compPattern[cycle]}
            );
            /*MODEL ACTIONS*/
            self.model.setProps({
            'userTurn': true
          });
          clearInterval(interval)
        })
      }
    })

    /**RESPOND TO USER'S CHOICE**/
    self.view.bind('chooseColor', function (userChoice) {
      if (self.model.userTurn) {
        /*MODEL ACTIONS*/
        self.model.setProps({
          'userTurn': false,
          'userPattern': addToPattern(userChoice, self.model.userPattern)
        });
        /*VIEW ACTIONS*/
        self.view.render(
          'displayLightOn', {color: userChoice}
        );

        /*HANDLE CORRECT USER CHOICE*/
        if (patternsMatch(self.model.userPattern, self.model.compPattern)) {
          if (patternIsComplete(self.model.userPattern, self.model.compPattern)) {
            /*MODEL ACTIONS*/
            self.model.setProps({
              'correctCount': ++self.model.correctCount,
              'speed': self.model.correctCount > 7 ? 700 : self.model.speed,
              'userPattern': [],
              'compPattern': addToPattern(getRandomColor(self.model.colors), self.model.compPattern)
            });
            /*VIEW ACTIONS*/
            self.view.render(
              'displayCount', {count: self.model.correctCount}
            );

            /*HANDLE WINNING CASE*/
            if (isWinner(self.model.correctCount, 15)) {
              /*MODEL ACTIONS*/
              self.model.setProps({
                'userTurn': false
              })
              /*VIEW ACTIONS*/
              self.view.render(
                'displayWinnerModal'
              );
            } else {
              cyclePattern(
                self.model.speed,
                function (cycle, interval) {
                if (self.model.on) {
                  /*VIEW ACTIONS*/
                  self.view.render(
                    'displayLightOn', {color: self.model.compPattern[cycle]}
                  );
                  if ((cycle + 1) === self.model.compPattern.length) {
                    /*MODEL ACTIONS*/
                    self.model.setProps({
                      'userTurn': true
                    });
                    clearInterval(interval);
                  }
                } else {
                  clearInterval(interval);
                }
              })
            }
          } else {
            /*MODEL ACTIONS*/
            self.model.setProps({
              'userTurn': true
            })
          }

        /*HANDLE INCORRECT USER CHOICE*/
        } else {
          /*MODEL ACTIONS*/
          self.model.setProps({
            'userPattern': [],
            'compPattern': self.model.strictMode ? addToPattern(getRandomColor(self.model.colors), []) : self.model.compPattern,
            'correctCount': self.model.strictMode ? 0 : self.model.correctCount,
            'speed': self.model.strictMode ? 1300 : self.model.speed
          });
          /*VIEW ACTIONS*/
          self.view.render(
            'displayCountError', {count: self.model.correctCount}
          );
          cyclePattern(
            self.model.speed,
            function (cycle, interval) {
            if (self.model.on) {
              /*VIEW ACTIONS*/
              self.view.render(
                'displayLightOn', {color: self.model.compPattern[cycle]}
              );
              if ((cycle + 1) === self.model.compPattern.length) {
                /*MODEL ACTIONS*/
                self.model.setProps({
                  'userTurn': true
                })
                clearInterval(interval);
              }
            } else {
              clearInterval(interval)
            }
          });
        }
      }
    })

    /**RESET GAME**/
    self.view.bind('playAgain', function () {
      /*MODEL ACTIONS*/
      self.model = self.model.reset();
      self.model.setProps({
        'on': true,
        'started': true,
        'compPattern': addToPattern(getRandomColor(self.model.colors), self.model.compPattern)
      });
      /*VIEW ACTIONS*/
      self.view.render(
        'displayCount', {count: self.model.correctCount}
      );
      self.view.render(
        'hideWinnerModal'
      );
      cyclePattern(
        self.model.speed,
        function (cycle, interval) {
          /*VIEW ACTIONS*/
          self.view.render(
            'displayLightOn',{color: self.model.compPattern[cycle]}
          );
          /*MODEL ACTIONS*/
          self.model.setProps({
          'userTurn': true
        });
        clearInterval(interval);
      })
    })

  /**END OF CONTROLLER CONSTRUCTOR**/
  }






  Controller.prototype.getRandomColor = function (colors = []) {
    var randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  Controller.prototype.cyclePattern = function (speed, callback) {
    var cycle = 0;
    var interval = setInterval(function () {
      callback(cycle, interval);
      cycle++;
    }, speed)
  }

  Controller.prototype.resetPattern = function () {
    return [];
  }

  Controller.prototype.addToPattern = function (color, pattern = []) {
    var newPattern = pattern;
    newPattern.push(color);
    return newPattern;
  }

  Controller.prototype.patternsMatch = function (patternOne, patternTwo) {
    for (var i = 0; i < patternOne.length; i++) {
      if (patternOne[i] !== patternTwo[i]) {
        return false;
      }
    }
    return true;
  }

  Controller.prototype.patternIsComplete = function (patternOne, patternTwo) {
    return (patternOne.length === patternTwo.length);
  }

  Controller.prototype.isWinner = function (currentCount, winningCount) {
    return currentCount === winningCount;
  }



  exports.app = exports.app || {};
  exports.app.Controller = Controller;
}(window))
