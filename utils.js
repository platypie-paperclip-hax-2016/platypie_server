var utils = {}
var fetch = require("node-fetch")

utils.fbMessage = function(id, text) {
    const body = JSON.stringify({
        recipient: { id: id },
        message: { text: text },
    });
    const qs = 'access_token=' + encodeURIComponent(process.env.FB_ACCESS_TOKEN);
    return fetch('https://graph.facebook.com/me/messages?' + qs, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: body
        })
        .then(function(rsp) { rsp.json() })
        .then(function(json) {
            if (json.error && json.error.message) {
                throw new Error(json.error.message);
            }
            return json;
        })
}

utils.createStore = function() {
    var sessions = {}
    var entryIds = []
    var messageIds = []

    return {
        findOrCreateSession: function(fbid) {
            var sessionId;
            // Let's see if we already have a session for the user fbid
            Object.keys(sessions).forEach(function(k) {
                if (sessions[k].fbid === fbid) {
                    // Yep, got it!
                    sessionId = k;
                }
            });
            if (!sessionId) {
                // No session found for user fbid, let's create a new one
                sessionId = new Date().toISOString();
                sessions[sessionId] = {fbid: fbid, context: {}};
            }
            return sessionId;
        },
        addEntry: function(id) {
            entryIds.push(id)
        },
        entryExists: function(id) {
            return entryIds.indexOf(id) == 1
        },
        addMessage: function(id) {
            messageIds.push(id)
        },
        messageExists: function(id) {
            return messageIds.indexOf(id) == 1
        },
        getSession: function(id) {
            return sessions[id]
        }

    }
}


module.exports = utils