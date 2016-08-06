var router = require("express").Router()
var util = require('util')
var fbMessage = require("../utils").fbMessage

var store = require("../utils").createStore()
var wit = require("../controllers/witBot")(store)

router.route("/fb/messages")
    .get(function (req, res) {
        if (req.query['hub.mode'] === 'subscribe' &&
            req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
            console.log("Validating webhook");
            res.status(200).send(req.query['hub.challenge']);
        } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            res.sendStatus(403);
        }
    })
    .post(function (req, res) {
        // Message handler
        // Parse the Messenger payload
        // See the Webhook reference
        // https://developers.facebook.com/docs/messenger-platform/webhook-reference
        var data = req.body;

        if (data.object === 'page') {
            console.log("\nNew Entry")
            var filteredEntries = data.entry.filter(function(entry) {
                return !store.entryExists(entry.id)
            })
            filteredEntries.forEach(function (entry) {
                store.addEntry(entry.id)

                var filteredMessages = entry.messaging.filter(function(event) {
                    return !store.messageExists(event.message.mid)
                })
                filteredMessages.forEach(function (event) {
                    if (event.message) {
                        store.addMessage(event.message.mid)
                        const sender = event.sender.id;
                        const sessionId = store.findOrCreateSession(sender);

                        var text = event.message.text
                        var attachments = event.message.attachments

                        if (attachments) {
                            // We received an attachment
                            fbMessage(sender, 'Sorry I can only process text messages for now.')
                                .catch(console.error);
                        } else if (text) {
                            // We received a text message
                            console.log("Message received:" + text)
                            fbMessage(sender, "Message received")
                            // wit.converse(sessionId, text, store.getSession(sessionId).context)
                            //     .then(function(data) {
                            //         console.log("Received response from wit")
                            //         console.log(util.inspect(data, {depth: null, breakLength: 100}))
                            //     })
                            wit.runActions(
                                sessionId, // the user's current session
                                text, // the user's message
                                store.getSession(sessionId).context // the user's current session state
                            ).then(function (context) {
                                console.log('Received context from wit:' + context);

                                // Based on the session state, you might want to reset the session.
                                // This depends heavily on the business logic of your bot.
                                // Example:
                                // if (context['done']) {
                                //   delete sessions[sessionId];
                                // }

                                store.getSession(sessionId).context = context;
                            })
                            .catch(function(err) {
                                console.error('Oops! Got an error from Wit: ', err.stack || err);
                            })
                        }
                    } else {
                        console.log('received event', JSON.stringify(event));
                    }
                });
            });
        }
        res.sendStatus(200);
    })

module.exports = router

