var router = require("express").Router()

router.route("/fb/messages")
    .get(function (req, res) {
        if (req.query['hub.mode'] === 'subscribe' &&
            req.query['hub.verify_token'] === process.env.VALIDATION_TOKEN) {
            console.log("Validating webhook");
            res.status(200).send(req.query['hub.challenge']);
        } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            res.sendStatus(403);
        }
    })
    .post(function (req, res) {
        var data = req.body;

        if (data.object == 'page') {
            data.entry.forEach(function (pageEntry) {
                console.log(pageEntry)
            });
            res.sendStatus(200);
        }
    })

module.exports = router
