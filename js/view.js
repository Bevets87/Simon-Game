(function (window) {

  'use strict'

  function View () {
    var self = this;

    this.$buttonColors = {
      'red': document.getElementById('red'),
      'green': document.getElementById('green'),
      'yellow': document.getElementById('yellow'),
      'blue': document.getElementById('blue')
    }

    this.$buttonColorSounds = {
      'red': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
      'green': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
      'yellow': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
      'blue': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
      'error': new Audio('http://www.zapsplat.com/wp-content/uploads/2015/sound-effects-three/leisure_retro_arcade_game_incorrect_error_tone.mp3')
    }

    this.$countDisplay = document.getElementById('count');

    this.$startButton = document.getElementById('start-button');

    this.$strictButton = document.getElementById('strict-button');
    this.$strictLedDisplay = document.getElementById('strict-led');

    this.$offSideButton = document.getElementById('off-side');
    this.$onSideButton = document.getElementById('on-side');

    this.$winnerTitle = document.getElementById('winner-title');

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
    if (event === 'startGame') {
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
          handler(e);
        })
      }
    }
  }

  View.prototype.render = function (cmd, state) {
    var self = this;

    var viewCommands = {
      'displayCount': function () {
        self.$countDisplay.innerText = '';
        self.$countDisplay.innerText = state.count;
      },
      'displayLightOn': function () {
        self.$buttonColors[state.color].className = state.color +'-light';
        self.$buttonColorSounds[state.color].play();
      },
      'displayErrorLightOn': function () {
        self.$buttonColors[state.color].className = state.color +'-light';
        self.$buttonColorSounds['error'].play();
      },
      'displayLightOff': function () {
        self.$buttonColors[state.color].className = '';
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
      'displayWinnerTitle': function () {
        self.$winnerTitle.style.display = 'block';
      },
      'hideWinnerTitle': function () {
        self.$winnerTitle.style.display = 'none';
      }
    }
    viewCommands[cmd]();

  }

  window.app = window.app || {};
  window.app.View = View;
}(window))
