export default async function fetchApi(path, options) {
	const request = await fetch(`/api/${path}`, {
		method: 'GET',
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		...options
	});
	const response = await request.json();

	return response;
}
