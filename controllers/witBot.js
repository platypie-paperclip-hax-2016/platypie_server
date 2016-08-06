var fbMessage = require("../utils").fbMessage
var models = require("../models")
var Wit = require("node-wit").Wit

function witWrapper(store) {

    var actions = {
        send: function(request, response) {
            return new Promise(function(resolve, reject) {
                var fbId = store.getSession(request.sessionId)
                fbMessage(fbId, response.text)
                resolve()
            })
        },
        getMajor: function(request) {
            console.log("#getMajor() called")
            return new Promise(function(resolve, reject) {
                var context = request.context
                if (request.entities.intent) {

                } else if (request.entities.major) {
                    context.major = request.entities.major.value
                    models.Major.findOne({
                        name: context.major
                    }, function(err, major) {
                        if (err) reject(err.message)
                        if (!major) reject("Major not found")
                        else {
                            console.log(major)
                            context.majorUrl = process.env.BASE_URL + "/major/"+major._id
                            resolve(context)
                        }
                    })
                }
            })
        }
    }

    return new Wit({
        accessToken: process.env.AI_ACCESS_TOKEN,
        actions: actions
    })
}


module.exports = witWrapper