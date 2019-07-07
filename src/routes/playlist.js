const router = require('express').Router();
const crypto = require('crypto-js');
const fetch = require('node-fetch');

const importPlaylistPaths = require('../assets/js/playlistManager');

router.get('/:hash', (req, res) => {
	if (req.headers['content-type'] === undefined) {
		const validHash = req.params.hash.replace('-', '+').replace('_', '/');
		const parsedWordArray = crypto.enc.Base64.parse(validHash);
		const parsedStr = parsedWordArray.toString(crypto.enc.Utf8).split('/');

		fetch.default(`http://localhost:3000/api/user/${parsedStr[0]}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})	
			.then((response) => response.json())
			.then(async (userData) => {
				const { unsubscription_date } = userData;

				// Если была исчерпана подписка - выводить картинку со шреком
				if (new Date(Date.now()) >= new Date(unsubscription_date)) {
					res.redirect('/static/images/expiredSubscribe.jpg');
				}
				else {
					const playlistPaths = await importPlaylistPaths.default(true);

					const playlistReq = await fetch.default(new URL(playlistPaths[0], 'http://localhost:3000'));
					const playlistRes = await playlistReq.text();

					const playlistItemRegExp = new RegExp(/#EXTINF:(.*?),(.*?)$\n#EXTGRP:(.*?)$\n(.*)$/gm);

					playlistRes.match(playlistItemRegExp).forEach((item) => {
						const parsedPlaylistItem = /#EXTINF:(\1-?[0-9]*),(\2.*)$\n#EXTGRP:(\3.*?)\n(\4.*)/gm.exec(item);

						if (parsedPlaylistItem[2] === parsedStr[1]) {
							res.redirect(parsedPlaylistItem[4]);
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
