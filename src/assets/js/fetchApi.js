export default async function fetchApi(path, options) {
	const request = await fetch(`/api/${path}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		...options
	});
	const response = await request.json();

	return response;
}
