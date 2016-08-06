var actions = {
    getMajor: function(context, entities) {
        return new Promise(function(resolve, reject) {
            
        })
    }
}


var Wit = require("node-wit").Wit
var client = new Wit({
    accessToken: process.env.AI_ACCESS_TOKEN,
    actions: actions
})

module.exports = client