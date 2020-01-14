const fetch = require('node-fetch');
const AbortController = require('abort-controller');
class EndpointServerSideError extends Error {
    constructor(res) {
        super(res.message); // (1)
        this.name = "EndpointServerSideError"; // (2)
    }
}
class RequiredFieldMissingError extends Error {
    constructor(res) {
        super(res); // (1)
        this.name = "RequiredFieldMissingError"; // (2)
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
E.prototype.checkParamsDefined = function(params) {
    if (params.every(param => param == undefined)) throw new RequiredFieldMissingError('param missing');
}
E.prototype.users = async function() {};
E.prototype.ewc = async function() {};
E.prototype.matches.__proto__ = E.prototype;
E.prototype.users.__proto__ = E.prototype;
E.prototype.ewc.__proto__ = E.prototype;
E.prototype.matches.calculateElo = async function(options) {

    return this.apiCall('/matches/calc_elo', options);
}
E.prototype.users.elo = async function(userId, options) {
    return this.apiCall(`/users/elo/${userId}`, options);
}
E.prototype.users.recentPlay = async function(userId, options) {
    return this.apiCall(`/users/recentPlay/${userId}`, options);
}
E.prototype.users.dad = async function(userId, options) {
    return this.apiCall(`/users/dad/${userId}`, options);
}
E.prototype.ewc.getTeam = async function(teamName, options) {
    return this.apiCall(`/ewc/get_team/${teamName}`, options);
}
E.prototype.ewc.getTeamRank = async function(rank, options) {
    return this.apiCall(`/ewc/get_team_rank/${rank}`, options);
}
E.prototype.ewc.join = async function(options) {
    let { team_name, user_id } = options.body;
    this.checkParamsDefined([team_name, user_id]);
    return this.apiCall(`/ewc/join`, Object.assign({ method: 'POST' }, options));
}
E.prototype.ewc.quit = async function(options) {
    let { team_name, user_id } = options.body;
    this.checkParamsDefined([team_name, user_id]);
    return this.apiCall(`/ewc/quit`, Object.assign({ method: 'POST' }, options));
}
E.prototype.ewc.register = async function(options) {
    let { team_name } = options.body;
    this.checkParamsDefined([team_name]);
    return this.apiCall(`/ewc/register`, Object.assign({ method: 'POST' }, options));
}
module.exports = E;