var router = require("express").Router()

router.get("/", function(req, res) {
    res.json({
        success: true,
        message: "Server is healthy"
    })
})

module.exports = router