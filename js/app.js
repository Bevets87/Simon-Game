(function () {

  'use strict'

  function App () {
    this.model = new app.Model()
    this.view =  new app.View()
    this.controller = new app.Controller(this.model, this.view)
  }

  new App ()
})()
