(function (exports) {

  'use strict'

  function Controller (model, view) {
    var self = this;

    self.model = model;
    self.view = view;

    var {
      cyclePattern,
      getRandomColor,
      patternsMatch,
      patternIsComplete,
      resetPattern,
      addToPattern,
      isWinner
    } = self;

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
          self.model.compPattern,
          function (color) {
            /*VIEW ACTIONS*/
            self.view.render(
              'displayLightOn',{color: color}
            );
            /*MODEL ACTIONS*/
            self.model.setProps({
            'userTurn': true
          });
        })
      }
    })

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
        if ( patternsMatch(self.model.userPattern, self.model.compPattern) ) {
          self.model.setProps({
            'userTurn': true
          })
          if ( patternIsComplete(self.model.userPattern, self.model.compPattern) ) {
            self.model.setProps({
              'correctCount': ++self.model.correctCount,
              'speed': self.model.correctCount > 7 ? 700 : self.model.speed,
              'userPattern': [],
              'compPattern': addToPattern(getRandomColor(self.model.colors), self.model.compPattern)
            });
            self.view.render(
              'displayCount', {count: self.model.correctCount}
            );
            if (isWinner(self.model.correctCount, 15)) {
              self.model.setProps({
                'userTurn': false
              })
              self.view.render(
                'displayWinnerModal'
              );
            } else {
              cyclePattern(
                self.model.speed,
                self.model.compPattern,
                function (color, cycle) {
                if (self.model.on) {
                  self.model.setProps({
                    'userTurn': cycle === self.model.compPattern.length ? true : false
                  });
                  self.view.render(
                    'displayLightOn', {color: color}
                  );
                }
              })
            }
          }
        } else {
          self.model.setProps({
            'userPattern': [],
            'compPattern': self.model.strictMode ? addToPattern(getRandomColor(self.model.colors), []) : self.model.compPattern,
            'correctCount': self.model.strictMode ? 0 : self.model.correctCount,
            'speed': self.model.strictMode ? 1300 : self.model.speed
          });
          self.view.render(
            'displayCountError', {count: self.model.correctCount}
          );
          cyclePattern(
            self.model.speed,
            self.model.compPattern,
            function (color, cycle) {
            if (self.model.on) {
              self.model.setProps({
                'userTurn': cycle === self.model.compPattern.length ? true : false
              })
              self.view.render(
                'displayLightOn', {color: color}
              );
            }
          });
        }
      }
    })

    self.view.bind('playAgain', function () {
      self.model = self.model.reset();
      self.view.render(
        'hideWinnerModal'
      );
      self.model.setProps({
        'on': true,
        'started': true,
        'compPattern': addToPattern(getRandomColor(self.model.colors), self.model.compPattern)
      });
      self.view.render(
        'displayCount', {count: self.model.correctCount}
      );
      cyclePattern(
        self.model.speed,
        self.model.compPattern,
        function (color) {
          self.view.render(
            'displayLightOn',{color: color}
          );
          self.model.setProps({
          'userTurn': true
        });
      })
    })

  }






  Controller.prototype.getRandomColor = function (colors = []) {
    var randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  Controller.prototype.cyclePattern = function (speed, array = [], callback) {
    for (var i = 0; i < array.length; i++) {
      (function (i) {
        setTimeout(function () {
          callback(array[i], (i + 1))
        }, speed * (i + 1));
      }(i))
    }
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
