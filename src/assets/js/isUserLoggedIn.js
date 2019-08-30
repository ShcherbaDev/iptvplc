import fetchApi from './fetchApi';

// Check if user is logged in
export default async function isUserLoggedIn() {
	const request = await fetchApi('login', {
		credentials: 'same-origin'
	});

	return { isLoggedIn: request.isLoggedIn, username: request.username, id: request.id };
}
