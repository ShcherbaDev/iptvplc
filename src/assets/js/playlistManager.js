export default function importPlaylistPaths(isAbsoulutePath = false) {
	const req = require.context('../../playlists/', false, /.(m3u|m3u8)$/);

	const resultPlaylistArr = [];

	req.keys().forEach((item) => {
		if (isAbsoulutePath) {
			resultPlaylistArr.push(`http://localhost:3000/playlists/${item.slice(2, item.length)}`);
		}
		else {
			resultPlaylistArr.push(`${item.slice(0, 2)}playlists/${item.slice(2, item.length)}`);
		}
	});

	return resultPlaylistArr;
}
