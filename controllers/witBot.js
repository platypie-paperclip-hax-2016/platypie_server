var fbMessage = require("../utils").fbMessage

function witWrapper(store) {

    var actions = {
        send: function(request, response) {
            return new Promise(function(resolve, reject) {
                var fbId = store.getSession(request.sessionId)
                fbMessage(fbId, response.text)
                resolve()
            })
        },
        getMajor: function(context, entities) {
            return new Promise(function(resolve, reject) {

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