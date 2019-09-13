/**
 * Парсер создан на основе кода от sajjadjaved01:
 * https://github.com/sajjadjaved01/iptv/blob/master/app/src/main/java/com/muparse/M3UParser.java
 */

export default function parseM3U(string) {
	const decodedPlaylistString = decodeURIComponent(
		escape(
			/^data:audio\/x-mpegurl;base64,/.test(string) ? atob(
				string.replace(
					'data:audio/x-mpegurl;base64,', ''
				)
			) : ''
		)
	);

	const EXT_M3U = '#EXTM3U';
	const EXT_INF = '#EXTINF:';
	const EXT_GRP = '#EXTGRP:';
	const EXT_LOGO = 'tvg-logo';
	const EXT_URL = /(http|https):\/\//;
	const lines = decodedPlaylistString.split(EXT_INF);

	const result = [];

	for (let i = 0; i < lines.length; i += 1) {
		const currentLine = lines[i];
		if (!currentLine.includes(EXT_M3U)) {
			const dataArray = currentLine.split(',');

			if (dataArray.length === 2) {
				let duration = null;
				let icon = null;
				let url = null;
				let name = null;
				let group = null;

				// Get duration and icon
				if (dataArray[0].includes(EXT_LOGO)) {
					duration = parseInt(dataArray[0].substring(0, dataArray[0].indexOf(EXT_LOGO)).replace(':', '').replace('\n', ''), 10);
					icon = dataArray[0].substring(dataArray[0].indexOf(EXT_LOGO) + EXT_LOGO.length).replace('=', '').replace('\n', '').replace(/\"/g, '');
				}
				else {
					duration = dataArray[0].replace(':', '').replace('\n', '');
				}

				// Get group
				if (dataArray[1].includes(EXT_GRP)) {
					name = dataArray[1].substring(0, dataArray[1].search(EXT_GRP) - 1).replace('\n', '');
					url = dataArray[1].substring(dataArray[1].search(EXT_URL)).replace('\n', '').replace('\r', '').replace(' ', '');
					group = dataArray[1].substring(dataArray[1].indexOf(EXT_GRP) + EXT_GRP.length).replace('\n', '').replace(url, '').replace(/\s$/, '');
				}
				else {
					url = dataArray[1].substring(dataArray[1].search(EXT_URL)).replace('\n', '').replace('\r', '').replace(' ', '');
					name = dataArray[1].substring(0, dataArray[1].search(EXT_URL) - 1).replace('\n', '');
				}

				result.push({
					id: result.length,
					active: false,
					duration,
					icon,
					name,
					group,
					url
				});
			}
		}
	}

	return result;
}
