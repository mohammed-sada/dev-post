import { auth } from './firebase';

const API = 'https://radiant-coast-70126.herokuapp.com';

export async function fetchFromApi(apiEndpoint, opts) {
    const { method, body } = { method: 'Post', body: null, ...opts };
    const user = auth?.currentUser;
    const token = user && await user.getIdToken();

    try {
        const res = await fetch(`${API}/${apiEndpoint}`, {
            method,
            ...(body && { body: JSON.stringify(body) }),
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            }
        });

        return res.json();
    } catch (error) {
        console.error(error);
    }

}