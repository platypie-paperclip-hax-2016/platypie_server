var utils = {}

utils.fbMessage = function(id, text) {
    const body = JSON.stringify({
        recipient: { id: id },
        message: { text: text },
    });
    const qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);
    return fetch('https://graph.facebook.com/me/messages?' + qs, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: body,
        })
        .then(function(rsp) { rsp.json() })
        .then(function(json) {
            if (json.error && json.error.message) {
            throw new Error(json.error.message);
        }
        return json;
    });
}


module.exports = utils