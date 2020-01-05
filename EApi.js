const fetch = require('node-fetch');
const AbortController = require('abort-controller');
class EndpointServerSideError extends Error {
    constructor(res) {
        super(res.message); // (1)
        this.name = "EndpointServerSideError"; // (2)
    }
}
async function checkStatus(res, json) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        if (res.status == 202) {
            if (json.code == 40004);
            else return new EndpointServerSideError(json);
        }
        return res;
    } else {
        return Error(json.message);
    }
}

function E(options) {
    this.options = options;
}
E.prototype.apiCall = async function(endpoint, options) {
    let response = await fetch(`http://api.osuwiki.cn:5005/api${endpoint}`, options)
    let json = await response.json();
    checkStatus(response, json);
    return json;
}
E.prototype.matches = async function(matchID, options) {
    return this.apiCall(`/matches/${matchID}`, options);
}
E.prototype.matchesPost = async function(options) {
    return this.apiCall(`/matches/`, Object.assign({ method: 'POST' }, options));
}
E.prototype.users = async function() {};
E.prototype.matches.__proto__ = E.prototype;
E.prototype.users.__proto__ = E.prototype;
E.prototype.matches.calculateElo = async function(options) {

    return this.apiCall('/matches/calc_elo', options);
}
E.prototype.users.elo = async function(userId, options) {
    return this.apiCall(`/users/elo/${userId}`, options);
}
E.prototype.users.recentPlay = async function(userId, options) {
    return this.apiCall(`/users/recentPlay/${userId}`, options);
}

module.exports = E;