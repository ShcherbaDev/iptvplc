export default function encodeM3U(data, encodeToBase64 = true) {
	let result = '#EXTM3U';

	data.forEach((item) => {
		const { name, icon, url } = item;

		result = result.concat(`\n#EXTINF:-1 tvg-logo="${icon}",${name}\n${url}`);
	});
	return encodeToBase64 ? `data:audio/x-mpegurl;base64,${btoa(unescape(encodeURIComponent(result)))}` : result;
}
