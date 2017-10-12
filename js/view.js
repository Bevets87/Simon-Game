(function (exports) {

  'use strict'

  function View () {
    var self = this;

    self.$buttonColors = {
      'red': document.getElementById('red'),
      'green': document.getElementById('green'),
      'yellow': document.getElementById('yellow'),
      'blue': document.getElementById('blue')
    }

    self.$buttonColorSounds = {
      'red': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
      'green': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
      'yellow': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
      'blue': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
    }

    self.$countDisplay = document.getElementById('count');

    self.$startButton = document.getElementById('start-button');

    self.$strictButton = document.getElementById('strict-button');
    self.$strictLedDisplay = document.getElementById('strict-led');

    self.$offSideButton = document.getElementById('off-side');
    self.$onSideButton = document.getElementById('on-side');

    self.$winnerModal = document.getElementById('winner-modal');

    self.$playAgainButton = document.getElementById('play-again');


  }

  View.prototype.bind = function (event, handler) {
    var self = this;
    if (event === 'turnSimonOn') {
      self.$offSideButton.addEventListener('click', function () {
        handler();
      })
    }
    if (event === 'turnSimonOff') {
      self.$onSideButton.addEventListener('click', function () {
        handler();
      })
    }
    if (event === 'startSimon') {
      self.$startButton.addEventListener('click', function () {
        handler();
      })
    }
    if (event === 'toggleStrictMode') {
      self.$strictButton.addEventListener('click', function () {
        handler();
      })
    }
    if (event === 'chooseColor') {
      for (var buttonColor in self.$buttonColors) {
        self.$buttonColors[buttonColor].addEventListener('click', function (e) {
          handler(e.target.id);
        })
      }
    }
    if (event === 'playAgain') {
      self.$playAgainButton.addEventListener('click', function () {
        handler()
      })
    }
  }

  View.prototype.render = function (cmd, state) {
    var self = this;

    var viewCommands = {
      'displayCount': function () {
        self.$countDisplay.innerText = '';
        self.$countDisplay.innerText = state.count;
      },
      'displayCountError': function () {
        self.$countDisplay.innerText = '!!';
        setTimeout(function () {self.$countDisplay.innerText = state.count;}, 500);
      },
      'displayLightOn': function () {
        self.$buttonColors[state.color].className = state.color +'-light';
        self.$buttonColorSounds[state.color].play();
        setTimeout(function () {self.$buttonColors[state.color].className = '';},500);
      },
      'displayStrictOn': function () {
        self.$strictLedDisplay.className = 'led-on';
      },
      'displayStrictOff': function () {
        self.$strictLedDisplay.className = '';
      },
      'displayOnMode': function () {
        self.$offSideButton.style.display = 'none';
        self.$onSideButton.style.display = 'block';
      },
      'displayOffMode': function () {
        self.$onSideButton.style.display = 'none';
        self.$offSideButton.style.display = 'block';
      },
      'displayWinnerModal': function () {
        self.$winnerModal.style.display = 'block';

      },
      'hideWinnerModal': function () {
        self.$winnerModal.style.display = 'none';
      }
    }
    viewCommands[cmd]();

  }

  exports.app = exports.app || {};
  exports.app.View = View;
}(window))
