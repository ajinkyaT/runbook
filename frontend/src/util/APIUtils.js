import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN) != null) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);
    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            }) .catch(error => {
                console.log(error);
        }))
};

export function getAllRuns() {
    return request({
        url: API_BASE_URL + "/joinruns",
        method: 'GET'
    });
}

export function getUserCreatedRuns(userId) {
    return request({
        url: API_BASE_URL + "/users/" + userId + "/runs",
        method: 'GET'   
    });
}

export function createRun(userId, runData) {
    return request({
        url: API_BASE_URL + "/users/" + userId + "/runs",
        method: 'POST',
        body: JSON.stringify(runData)
    });
}

export function joinRun(userId, runId, runData) {
    return request({
        url: API_BASE_URL + "/users/" + userId + "/joinrun/" + runId,
        method: 'PUT',
        body: JSON.stringify(runData)
    });
}

export function exitRun(userId, runId, runData) {
    return request({
        url: API_BASE_URL + "/users/" + userId + "/exitrun/" + runId,
        method: 'POST',
        body: JSON.stringify(runData)
    });
}

export function deleteRun(runId) {
    return request({
        url: API_BASE_URL + "/runs/" + runId,
        method: 'DELETE',
    });
}


export function createPost(userId, postData) {
    return request({
        url: API_BASE_URL + "/users/" + userId + "/posts",
        method: 'POST',
        body: JSON.stringify(postData)
    });
}

export function deletePost(userId, postId) {
    return request({
        url: API_BASE_URL + "/users/" + userId + "/posts/" +postId,
        method: 'DELETE',
    });
}

export function getUserCreatedPosts(userId) {
    return request({
        url: API_BASE_URL + "/users/" + userId + "/posts",
        method: 'GET'
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function editProfile(userId, editRequest) {
    return request({
        url: API_BASE_URL + "/users/" + userId,
        method: 'PUT',
        body: JSON.stringify(editRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}


export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/users/checkemailavailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/users/me",
        method: 'GET'
    });
}

export function getUserProfile(userId) {
    return request({
        url: API_BASE_URL + "/users/" + userId,
        method: 'GET'
    });
}
