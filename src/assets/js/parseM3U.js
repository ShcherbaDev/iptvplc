export default async function parseM3uToJson(path) {
	const request = await fetch(`${path}`);
	let response = await request.text();

	let result = response.match(/#EXTINF:(.*?) tvg-logo="(.*?)",(.*)\n#EXTGRP:(.*)\n(.*)/gm);

	let completedResult = {};

	result.forEach((item, index) => {
		const parsedPlaylistItem = /#EXTINF:(\1-?[0-9]*) tvg-logo="(\2.*?)",(\3.*)\n#EXTGRP:(\4.*)\n(\5.*)/gm.exec(item);

		/**
		 * Array items of parsedPlaylistItem
		 * 
		 * 0 - Not parsed playlist item string
		 * 1 - Playlist item duration
		 * 2 - Playlist item icon
		 * 3 - Playlist item name
		 * 4 - Playlist item group
		 * 5 - Path to playlist item for play
		 */

		if (Object.keys(completedResult).findIndex((item) => item === parsedPlaylistItem[4]) === -1) {
			completedResult[parsedPlaylistItem[4]] = [];
		}

		if (completedResult[parsedPlaylistItem[4]].findIndex((item) => item === parsedPlaylistItem) === -1) {
			completedResult[parsedPlaylistItem[4]].push({
				id: index,
				inf: {
					title: parsedPlaylistItem[3],
					group: parsedPlaylistItem[4],
					duration: parseInt(parsedPlaylistItem[1], 10),
					icon: parsedPlaylistItem[2]
				},
				url: parsedPlaylistItem[5]
			});
		}
	});
	
	return completedResult;
}
