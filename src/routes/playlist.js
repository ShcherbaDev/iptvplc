const router = require('express').Router();
const crypto = require('crypto-js');
const fetch = require('node-fetch').default;

const importPlaylistPaths = require('../assets/js/playlistManager').default;

router.get('/:hash', (req, res) => {
	const {
		APP_PROTOCOL, APP_DOMAIN, APP_PORT, APP_PLAYLIST_INDEX
	} = process.env;
	const appDomain = `${APP_PROTOCOL}://${APP_DOMAIN}:${APP_PORT}`;

	if (req.headers['content-type'] === undefined) {
		const validHash = req.params.hash.replace('-', '+').replace('_', '/');
		const parsedWordArray = crypto.enc.Base64.parse(validHash);
		const parsedStr = parsedWordArray.toString(crypto.enc.Utf8).split('/');

		fetch(`${appDomain}/api/user/${parsedStr[0]}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(async (userData) => {
				const { unsubscription_date } = userData;

				// Если была исчерпана подписка - выводить картинку
				if (new Date(Date.now()) >= new Date(unsubscription_date)) {
					res.redirect('/static/images/expiredSubscribe.jpg');
				}
				else {
					const playlistPaths = await importPlaylistPaths(true);

					const playlistReq = await fetch(new URL(playlistPaths[APP_PLAYLIST_INDEX], appDomain));
					const playlistRes = await playlistReq.text();

					const playlistItemRegExp = new RegExp(/#EXTINF:(.*?) tvg-logo=(.*?),(.*?)$\n#EXTGRP:(.*?)$\n(.*)$/gm);
					playlistRes.match(playlistItemRegExp).forEach((item, index) => {
						const parsedPlaylistItem = /#EXTINF:(\1-?[0-9]*) tvg-logo="(\2.*)",(\3.*)$\n#EXTGRP:(\4.*?)\n(\5.*)/gm.exec(item);

						if (index === parseInt(parsedStr[1], 10)) {
							res.redirect(parsedPlaylistItem[5]);
						}
					});
				}
			});
	}
	else {
		res.sendStatus(403);
	}
});

module.exports = router;
