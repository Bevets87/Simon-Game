(function (exports) {
  'use strict';

  function Iterator (collection) {
    var self = this;
    self.collection = collection;
    self.count = 0;
  }

  Iterator.prototype.next = function () {
    var self = this;
    return self.collection[self.count++]
  }

  Iterator.prototype.reset = function () {
    var self = this;
    self.count = 0;
  }

  Iterator.prototype.strictReset = function () {
    var self = this;
    self.collection.splice(0, self.collection.length);
    self.count = 0;
  }

  Iterator.prototype.hasNext = function () {
    var self = this;
    return self.count < self.collection.length;
  }

  function getRandomSimonColor () {
    var colors = ['red', 'yellow', 'blue', 'green'],
    randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex]
  }

  exports.Iterator = Iterator;
  exports.getRandomSimonColor = getRandomSimonColor;

})(window)
