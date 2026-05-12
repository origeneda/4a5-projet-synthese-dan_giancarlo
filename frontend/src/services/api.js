const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
    const { body, token, method = "GET" } = options;
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(responseData.message || "Erreur API");
    }

    return responseData;
}

export function loginUser(credentials) {
    return request("/auth/login", { method: "POST", body: credentials });
}

export function registerUser(payload) {
    return request("/auth/register", { method: "POST", body: payload });
}

export function getMatches() {
    return request("/matches");
}

export function getMatchById(matchId) {
    return request(`/matches/${matchId}`);
}

export function createMatch(payload, token) {
    return request("/matches", { method: "POST", body: payload, token });
}

export function updateMatch(matchId, payload, token) {
    return request(`/matches/${matchId}`, { method: "PATCH", body: payload, token });
}

export function deleteMatch(matchId, token) {
    return request(`/matches/${matchId}`, { method: "DELETE", token });
}

export function assignReferee(matchId, refereeId, token) {
    return request(`/matches/${matchId}/assign-referee`, {
        method: "POST",
        body: { refereeId },
        token,
    });
}

export function getReferees() {
    return request("/referees");
}

export function createReferee(payload, token) {
    return request("/referees", { method: "POST", body: payload, token });
}

export function updateReferee(refereeId, payload, token) {
    return request(`/referees/${refereeId}`, {
        method: "PATCH",
        body: payload,
        token,
    });
}

export function deleteReferee(refereeId, token) {
    return request(`/referees/${refereeId}`, { method: "DELETE", token });
}