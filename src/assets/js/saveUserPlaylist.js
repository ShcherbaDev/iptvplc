import crypto from 'crypto-js';
import isUserLoggedIn from './isUserLoggedIn';

export default function saveUserPlaylist(userPlaylist) {
	if (userPlaylist.length > 0) {
		isUserLoggedIn()
			.then((data) => {
				const { isLoggedIn, username } = data;

				if (isLoggedIn) {
					let m3uContent = '#EXTM3U';

					userPlaylist.forEach((playlistItem) => {
						const { inf } = playlistItem;
						const { title, group, duration } = inf;

						const playlistItemHash = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(`${username}/${title}`)).replace('+', '-').replace('/', '_');

						m3uContent += `\n#EXTINF:${duration},${title}\n#EXTGRP:${group}\nhttp://localhost:3000/playlist/${playlistItemHash}`;
					});

					const m3uData = `data:audio/x-mpegurl;charset=utf-8,${encodeURIComponent(m3uContent)}`;

					const downloadElement = document.createElement('a');
					downloadElement.href = m3uData;
					downloadElement.target = '_blank';
					downloadElement.download = 'playlist.m3u';

					document.body.appendChild(downloadElement);
					downloadElement.click();
					document.body.removeChild(downloadElement);
				}
			});
	}
}
