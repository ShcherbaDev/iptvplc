export default async function parseM3uToJson(path) {
	const request = await fetch(path);
	const response = await request.text();

	const splittedPlaylistItems = response.match(/#EXTINF:(.*?) tvg-logo="(.*?)",(.*)\n#EXTGRP:(.*)\n(.*)/gm);
	const result = {};

	splittedPlaylistItems.forEach((item, index) => {
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

		if (Object.keys(result).findIndex(resultObjectItem => resultObjectItem === parsedPlaylistItem[4]) === -1) {
			result[parsedPlaylistItem[4]] = [];
		}

		if (result[parsedPlaylistItem[4]].findIndex(groupItem => groupItem === parsedPlaylistItem) === -1) {
			result[parsedPlaylistItem[4]].push({
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

	return result;
}
