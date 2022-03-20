import { auth } from './firebase';

const API = 'http://localhost:5000';

export async function fetchFromApi(apiEndpoint, opts) {
    const { method, body } = { method: 'Post', body: null, ...opts };
    const user = auth?.currentUser;
    const token = user && await user.getIdToken();

    const res = await fetch(`${API}/${apiEndpoint}`, {
        method,
        ...(body && { body: JSON.stringify(body) }),
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        }
    });

    return res.json();
}