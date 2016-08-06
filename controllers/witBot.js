var fbMessage = require("../utils").fbMessage

function witWrapper(store) {

    var actions = {
        send: function(request, response) {
            console.log(response)
            return new Promise(function(resolve, reject) {
                var fbId = store.getSession(request.sessionId)
                fbMessage(fbId, response.text)
                resolve()
            })
        },
        getMajor: function(request) {
            console.log("#getMajor() called")
            return new Promise(function(resolve, reject) {
                resolve()
            })
        }
    }

    var Wit = require("node-wit").Wit
    return new Wit({
        accessToken: process.env.AI_ACCESS_TOKEN,
        actions: actions
    })
}

module.exports = witWrapper