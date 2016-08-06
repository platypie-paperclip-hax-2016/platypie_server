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
                console.log(request.entities)
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
                } else {
                    console.log("#getMajor() desired entities not found")
                    reject("Error")
                }
            })
        },
        getApplicationDeadline: function(request) {
            console.log("#getApplicationDeadline called")
            return new Promise(function(resolve, reject) {
                var entities = request.entities
                var context = request.context
                if (entities.university) {
                    var universityName = entities.university.value
                    models.University.findOne({name: universityName}, function(err, uni) {
                        if (err) reject(err.message)
                        else if (!uni) reject("University not found")
                        else {
                            context.application_deadline = uni.applicationDeadline
                            resolve(context)
                        }
                    })
                } else {
                    console.log("#getMajor() desired entities not found")
                    reject("Error")
                }
            })
        },
        getUniversity: function(request) {
            console.log("#getUniversity() called")
            return new Promise(function(resolve, reject) {
                let {entities, context} = request
                console.log(entities)
                if (entities.location || entities.major) {
                    new Promise(function(res, rej) {
                        models.User.findOne({
                            fbId: store.getSession(request.sessionId).fbid
                        }, function(err, city) {
                            if (err) rej(err)
                            if (!city) rej(new Error("City not found"))
                            else {
                                resolve(city._id)
                            }
                        })
                    }).then(function(city) {
                        models.University.populate("majors").findOne({
                            majors: {
                                name: entities.major[0].value
                            },
                            city: city
                        }, function(err, uni) {
                            if (err) reject(err.message)
                            else if (!uni) reject("University not found")
                            else {
                                context.university = uni.name
                                context.universityUrl = process.env.BASE_URL + "/university/" + uni._id
                            }
                        })
                    }, function(err) {
                        reject(err.message)
                    })
                } else {
                    console.log("#getUniversity() desired entities not found")
                    reject("Error")
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