import React, { Component, Fragment } from 'react';

import Card from '../../components/Card/Card';

import './Admin.scss';

class Admin extends Component {
	constructor(props) {
		super(props);

		this.state = {
			channelList: [],
			isLoading: true,
			selectedItemIds: [],
			groups: [
				{
					id: 0,
					name: 'Музыка'
				},
				{
					id: 1,
					name: 'Познавательные'
				},
				{
					id: 2,
					name: 'Кино'
				},
				{
					id: 3,
					name: 'Детские'
				},
				{
					id: 4,
					name: 'Развлекательные'
				},
				{
					id: 5,
					name: 'Новости'
				},
				{
					id: 6,
					name: 'СНГ'
				},
				{
					id: 7,
					name: 'Спорт'
				},
				{
					id: 8,
					name: 'Юмор'
				},
				{
					id: 9,
					name: 'Общество'
				},
				{
					id: 10,
					name: 'Информационные'
				},
				{
					id: 11,
					name: '-------------'
				},
				{
					id: 12,
					name: 'Разное'
				},
				{
					id: 13,
					name: 'Общие'
				},
				{
					id: 14,
					name: 'Развлечения'
				},
				{
					id: 15,
					name: 'Детское'
				},
				{
					id: 16,
					name: 'Политика'
				}
			]
		};
	}

	async componentDidMount() {
		const storage = localStorage || window.localStorage;

		if (storage.getItem('channels') === null) {
			const regex = /#EXTINF:(.*?) tvg-logo="(.*?)",(.*)\n#EXTGRP:(.*)\n(.*)/gm;
			const str = `
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Hit Music Channel
#EXTGRP:-------------
http://1mstream.digicable.hu/hitmusic/hitmusic.m3u8
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/2168.png",Астрахань 24 HD
#EXTGRP:-------------
http://cdn-01.bonus-tv.ru:8080/astrakhan24_edge/tracks-v1a1/index.m3u8
#EXTINF:-1 tvg-logo="http://online-red.com/images/tv/rgvk-dagestan.png",Дагестан ТВ [FHD]
#EXTGRP:-------------
http://dagestan.mediacdn.ru/cdn/dagestan/tracks-v2a1/index.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Дисконт
#EXTGRP:-------------
http://tvshops.bonus-tv.ru:80/cdn/discount/tracks-v1a1/index.m3u8
#EXTINF:-1 tvg-logo="http://tv-online.at.ua/1logo/1/strk.png",СТРК HD
#EXTGRP:-------------
http://sochi-strk.ru:1936/strk/strk.stream/playlist.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Вмире Животных HD
#EXTGRP:-------------
http://hls-v3-spbtv.msk.spbtv.com/for_spb/msk/ipv3/991.m3u8
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/2310.png",Эврика HD
#EXTGRP:-------------
http://hls-v3-spbtv.msk.spbtv.com/for_spb/msk/ipv3/992.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Viasat Explorer
#EXTGRP:-------------
http://ott-cdn.ucom.am/s72/index.m3u8
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/277.png",Viasat History
#EXTGRP:-------------
https://hls-viasat.cdnvideo.ru/hls/relay/1501746731655/index.m3u8?md5=2Dxnjzcr2UxtTABLqdfYTA&e=1541934953&hls_proxy_host=97544926393025ab05ebfb4dc3486095
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/765.png",Viasat Nature
#EXTGRP:-------------
http://ott-cdn.ucom.am/s67/index.m3u8
#EXTINF:0 tvg-logo="http://epg.it999.ru/img/675.png",Моя Планета
#EXTGRP:-------------
http://a3569456481-s26881.cdn.ngenix.net/live/smil:mplan.smil/chunklist_b1600000.m3u8
#EXTINF:-1 tvg-logo="https://is1-ssl.mzstatic.com/image/thumb/Purple122/v4/b3/18/55/b3185575-3032-59c5-4596-069423407be6/pr_source.jpg/246x0w.jpg",Silence TV WORLD HD
#EXTGRP:-------------
http://109.236.85.100:8081/SilenceTV/live/playlist.m3u8
#EXTINF:-1 tvg-logo="http://online-red.com/images/tv/sochi-live.png",Sochi Live HD
#EXTGRP:-------------
http://212.8.233.150:8081/sochi/sochi_stream/playlist.m3u8
#EXTINF:-1 tvg-logo="http://lime-tv.ru/uploads/posts/2018-04/thumbs/1522782017_gorstrana.jpg",Горная Страна HD
#EXTGRP:-------------
http://hls-sneg-pull2.cdnvideo.ru/sneg-pull2/KTS/playlist.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Buy Home TV
#EXTGRP:-------------
http://hls-edge.cdn.buy-home.tv/bhtvlive/_definst_/live/playlist.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Ocean TV
#EXTGRP:-------------
http://91.192.168.242:9091
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Ocean TV HD
#EXTGRP:-------------
http://live-oceantvhd.cdnvideo.ru/oceantvhd/oceantvhd/chunklist.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Океан ТВ
#EXTGRP:-------------
http://ott-cdn.ucom.am/s84/index.m3u8
#EXTINF:-1 tvg-logo="http://tv-radio.online/uploads/posts/2018-01/1516448611_rline.png",Красная линия ТВ
#EXTGRP:-------------
http://kprf-htlive.cdn.ngenix.net/live/_definst_/stream_high/playlist.m3u8
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/1036.png",История
#EXTGRP:-------------
http://182.73.122.74:10005/bysid/405
#EXTINF:0 tvg-logo="http://epg.it999.ru/img/2142.png",Настоящее время
#EXTGRP:-------------
http://rfe-lh.akamaihd.net/i/rfe_tvmc5@383630/master.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Наш Дом HD
#EXTGRP:-------------
http://85.234.33.60/stream/c11.m3u8
#EXTINF:-1 tvg-logo="data:image/jpeg;base64,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",РЖД ТВ HD
#EXTGRP:-------------
http://hls.tva.cdnvideo.ru/tva/tvahd.sdp/chunklist.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",ABTO 24
#EXTGRP:-------------
http://193.201.98.123:8000/play/a01p
#EXTINF:0 tvg-logo="http://frocus.net/images/logotv/world_fashion_channel.gif",World Fashion Channel Россия HD
#EXTGRP:-------------
http://wfc.bonus-tv.ru:80/cdn/wfcrus/tracks-v1a1/index.m3u8
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/2020.png",Дом Кино Премиум HD
#EXTGRP:-------------
http://91.231.219.145:80/tv_dom_kino_premium_HD/playlist.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",TV1000 Action
#EXTGRP:-------------
http://hls-v3-spbtv.msk.spbtv.com/for_spb/msk/ipv3/959.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",TV1000 Русское кино
#EXTGRP:-------------
http://kv-3ln-n01.ollcdn.net/hls-tv/18/128147972228ef43d29d88c5490c0005/5ca630d7/tv1000ruskino/tv1000ruskino.m3u8
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/644.png",Киномикс
#EXTGRP:-------------
http://hls-v3-spbtv.msk.spbtv.com/for_spb/msk/ipv3/885.m3u8
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/566.png",Кинопремьера HD
#EXTGRP:-------------
http://hls-v3-spbtv.msk.spbtv.com/for_spb/msk/ipv3/706.m3u8
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/542.png",Кинохит
#EXTGRP:-------------
http://hls-v3-spbtv.msk.spbtv.com/for_spb/msk/ipv3/707.m3u8
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/485.png",Наше новое кино
#EXTGRP:-------------
http://hls-v3-spbtv.msk.spbtv.com/for_spb/msk/ipv3/882.m3u8
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/12.png",Родное кино
#EXTGRP:-------------
http://hls-v3-spbtv.msk.spbtv.com/for_spb/msk/ipv3/960.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",FILMS TV
#EXTGRP:-------------
http://hls.goodgame.ru/hls/159693.m3u8
#EXTINF:0 tvg-logo="./static/images/nopic.jpg",Кинозал Зарубежная киноклассика
#EXTGRP:-------------
http://streams.tv.mts.by/zarubezhnaya_classica/1/index.m3u8
#EXTINF:0 tvg-logo="./static/images/nopic.jpg",Кинозал Советская киноклассика
#EXTGRP:-------------
http://streams.tv.mts.by/soviet_classic/1/index.m3u8
#EXTINF:0 tvg-logo="./static/images/nopic.jpg",Кинозал Индийская киноклассика
#EXTGRP:-------------
http://streams.tv.mts.by/indiyskaya_classica/1/index.m3u8
#EXTINF:0 tvg-logo="./static/images/nopic.jpg",Кинозал Классика Голливуда
#EXTGRP:-------------
http://streams.tv.mts.by/hollywood_classic/1/index.m3u8
#EXTINF:0 tvg-logo="./static/images/nopic.jpg",КиноЗаказ 1
#EXTGRP:-------------
http://hls.goodgame.ru/hls/12949.m3u8
#EXTINF:0 tvg-logo="./static/images/nopic.jpg",КиноЗаказ 2
#EXTGRP:-------------
http://hls.goodgame.ru/hls/5346.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Сделано в СССР
#EXTGRP:-------------
http://ussr.playlist-24.club/vFrwZBu0/p19YTcSe/playlist.m3u8
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/615.png",Fox Life
#EXTGRP:-------------
http://193.201.98.123:8000/play/a017
#EXTINF:0 tvg-logo="./static/images/nopic.jpg",Cineman ATV 
#EXTGRP:-------------
http://ott-cdn.ucom.am/s66/04.m3u8 
#EXTINF:0 tvg-logo="./static/images/nopic.jpg",Filmzone ATV 
#EXTGRP:-------------
http://ott-cdn.ucom.am/s48/04.m3u8 
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Беларусь 5 Спорт
#EXTGRP:-------------
http://95.46.208.76:9898/belarus5
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Disney канал
#EXTGRP:-------------
http://95.216.187.219:8080/081-disney
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/323.png",2x2
#EXTGRP:-------------
http://video-4-306.rutube.ru/stream/10113616/5c7a9178adf67b6976216334abb42f4f/tracks-v1a1/mono.m3u8
#EXTINF:0 tvg-logo="./static/images/nopic.jpg",Мультимания 
#EXTGRP:-------------
http://82.193.71.93/MultimaniaLV/video.m3u8 
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",HTB
#EXTGRP:-------------
http://109.95.47.229:809/84/index.m3u8
#EXTINF:0 tvg-logo="./static/images/nopic.jpg",Звезда 
#EXTGRP:-------------
http://cdn-01.bonus-tv.ru:8080/zvezda/index.m3u8
#EXTINF:-1 tvg-logo="http://smotret-onlajn.net/assets/images/onlineTV/pyatnica.jpg",ПЯТНИЦА! HD
#EXTGRP:-------------
https://video-4-306.rutube.ru/stream/10113616/9f87a9a0cecbe773be6fddcbd93585ac/mono.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",ПOЕХАЛИ!
#EXTGRP:-------------
http://193.201.98.123:8000/play/a016
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/2288.png",СУПЕР
#EXTGRP:-------------
https://video-4-205.rutube.ru/stream/10113616/dfbae35e461b25d827319d93ed5c1d76/tracks-v1a1/mono.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",ТВ-3
#EXTGRP:-------------
https://video-4-206.rutube.ru/stream/10113616/7bf12d9c050f9a7ef3728db5730432ae/tracks-v1a1/mono.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Ю
#EXTGRP:-------------
http://193.201.98.123:8000/play/a00y
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Крик ТВ
#EXTGRP:-------------
http://cdn-01.bonus-tv.ru:8080/kriktv_edge/tracks-v1a1/index.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",TV Brics HD
#EXTGRP:-------------
http://live2.mediacdn.ru/sr1/tvbrics/playlist.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Вместе РФ HD
#EXTGRP:-------------
http://cdn-01.bonus-tv.ru:8080/vmesterf/tracks-v1a1/index.m3u8
#EXTINF:-1 tvg-logo="http://epg.it999.ru/img/2168.png",Астрахань 24 HD
#EXTGRP:-------------
http://cdn-01.bonus-tv.ru:8080/astrakhan24_edge/tracks-v1a1/index.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",GTV
#EXTGRP:-------------
http://77.123.139.122:8081/a1od/gtvod-abr/a1od/gtvod-720p/playlist.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Citi TV
#EXTGRP:-------------
http://api.tv.ipnet.ua/api/v1/manifest/2118742470.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",RUTV HD
#EXTGRP:-------------
http://live-rmg.cdnvideo.ru/rmg/rutv_new.sdp/playlist.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",Music Box RU Gold
#EXTGRP:-------------
http://live-musicbox.cdnvideo.ru/musicbox2/mboxtv.sdp/playlist.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",HIT TV HD
#EXTGRP:-------------
http://kissfm-cires21-video.secure.footprint.net/hittv/bitrate_4.m3u8
#EXTINF:-1 tvg-logo="./static/images/nopic.jpg",NRJ Hits
#EXTGRP:-------------
http://5.196.138.6:1935/live/nrjbelgique_720p/playlist.m3u8
#EXTINF:0 tvg-logo="./static/images/nopic.jpg",NRJ Hits HD
#EXTGRP:-------------
http://5.196.138.6:1935/live/nrjbelgique_720p/playlist.m3u8`;

			let result = [];

			str.match(regex).forEach((item) => {
				result.push(/#EXTINF:(\1-?[0-9]*) tvg-logo="(\2.*?)",(\3.*)\n#EXTGRP:(\4.*)\n(\5.*)/.exec(item));
			});

			let finalResult = [];

			result.forEach((item, index) => {

				finalResult.push(
					{
						id: index,
						inf: {
							title: item[3],
							groupId: this.state.groups[this.state.groups.findIndex((group) => group.name === item[4])].id,
							duration: parseInt(item[1], 10),
							icon: item[2]
						},
						url: item[5]
					}
				);
			});
			this.setState({ channelList: finalResult, isLoading: false });
		}
		else {
			this.setState({
				channelList: JSON.parse(storage.getItem('channels')),
				groups: JSON.parse(storage.getItem('groups')),
				isLoading: false
			});
			console.log(this.state);
			console.log('Вся информация была успешно загружена.');
		}
	}

	componentWillMount() {
		window.addEventListener('beforeunload', (e) => {
			this.saveData();
			e.preventDefault();
			e.returnValue = '';
		});
	}

	addGroup() {
		this.setState({
			groups: [
				...this.state.groups,
				{
					name: 'Неименованная категория',
					id: this.state.groups.length
				}
			]
		});
	}

	selectPlaylistItem(playlistItem, event) {
		const { id } = playlistItem;
		const { ctrlKey } = event;
		const { selectedItemIds } = this.state;

		// If playlist item is exist
		if (selectedItemIds.indexOf(id) !== -1) {
			// I used slice method for deleting array item instead of filter method because of the better performance.
			this.setState({ selectedItemIds: [
				...selectedItemIds.slice(0, selectedItemIds.indexOf(id)),
				...selectedItemIds.slice(selectedItemIds.indexOf(id) + 1)
			]});
		}
		// Otherwise set new selected playlist item.
		else {
			if (!ctrlKey) {
				this.setState({ selectedItemIds: [id] });
			}
			else {
				this.setState({ selectedItemIds: [...selectedItemIds, id] })
			}
		}
	}

	getPlaylistItemsByIds(ids = this.state.selectedItemIds) {
		// If it's an array with few items.
		if (ids.length > 1) {
			let result = [];

			ids.forEach((itemId) => {
				if (this.state.channelList.findIndex((item) => item.id === itemId) !== -1) {
					result.push(this.state.channelList[this.state.channelList.findIndex((item) => item.id === itemId)]);
				}
			});

			return result;
		}
		else {
			return this.state.channelList[this.state.channelList.findIndex((item) => item.id === this.state.selectedItemIds[0])];
		}
	}

	setPlaylistItemName(event) {
		const selectedItemId = this.state.channelList.findIndex((item) => item.id === this.state.selectedItemIds[0]);
		const selectedItem = this.state.channelList[selectedItemId];

		const newSelectedItem = {
			...selectedItem,
			inf: {
				...selectedItem.inf,
				title: event.target.value
			}
		};

		const newChannelList = this.state.channelList;
		newChannelList[selectedItemId] = newSelectedItem;

		this.setState({
			channelList: newChannelList
		});
	}

	setPlaylistItemGroup(event) {
		const { channelList, selectedItemIds, groups } = this.state;

		if (selectedItemIds.length > 1) {
			const newChannelList = this.state.channelList;

			selectedItemIds.forEach((itemId) => {
				const selectedItem = channelList[channelList.findIndex((item) => item.id === itemId)];

				selectedItem.inf.groupId = groups[groups.findIndex((group) => group.id === parseInt(event.target.value, 10))].id;
				
				newChannelList[channelList.findIndex((item) => item.id === selectedItemIds[itemId])] = selectedItem;
			});

			this.setState({
				channelList: newChannelList
			});
		}
		else {
			const selectedItemId = channelList.findIndex((item) => item.id === selectedItemIds[0]);
			const selectedItem = channelList[selectedItemId];
			
			const newSelectedItem = {
				...selectedItem,
				inf: {
					...selectedItem.inf,
					groupId: groups[parseInt(event.target.value)].id
				}
			};

			const newChannelList = channelList;
			newChannelList[selectedItemId] = newSelectedItem;

			this.setState({
				channelList: newChannelList
			});
		}
	}

	setNewGroupName(event) {
		const { groups } = this.state;

		const necessaryGroup = groups[groups.findIndex((group) => group.id === parseInt(event.target.name, 10))];
		necessaryGroup.name = event.target.value;

		const newGroupList = groups;
		newGroupList[groups.findIndex((group) => group.id === necessaryGroup.id)] = necessaryGroup;

		this.setState({
			groups: newGroupList
		});
	}

	setPlaylistItemIcon(event) {
		const selectedItemId = this.state.channelList.findIndex((item) => item.id === this.state.selectedItemIds[0]);
		const selectedItem = this.state.channelList[selectedItemId];

		const newSelectedItem = {
			...selectedItem,
			inf: {
				...selectedItem.inf,
				icon: event.target.value
			}
		};

		const newChannelList = this.state.channelList;
		newChannelList[selectedItemId] = newSelectedItem;

		this.setState({
			channelList: newChannelList
		});
	}

	saveData() {
		const storage = localStorage || window.localStorage;
		
		storage.setItem('groups', JSON.stringify(this.state.groups));
		storage.setItem('channels', JSON.stringify(this.state.channelList));

		console.log('Saved');
	}

	download() {
		let m3uContent = '#EXTM3U';

		this.state.channelList.forEach((playlistItem) => {
			const { inf, url } = playlistItem;
			const { title, groupId, duration, icon } = inf;

			const playlistItemGroup = this.state.groups[this.state.groups.findIndex((group) => group.id === groupId)].name;

			m3uContent += `\n#EXTINF:${duration} tvg-logo="${icon}",${title}\n#EXTGRP:${playlistItemGroup}\n${url}`;
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

	render() {
		return (
			<div className="admin container-fluid" style={{ height: '100%' }}>
				<Card title="Админка" bodyStyle={{ height: '65vh' }}>
					{!this.state.isLoading && (
						<div className="row" style={{ height: '100%' }}>
							<div className="col-5 channels" style={{ height: '100%', overflow: 'auto' }}>
								<table>
									<thead>
										<tr>
											<th>Иконка</th>
											<th>Название канала</th>
											<th>Категория</th>
										</tr>
									</thead>
									<tbody>
										{this.state.channelList.map((playlistItem) =>
											<tr key={playlistItem.id.toString()} onClick={this.selectPlaylistItem.bind(this, playlistItem)} className={this.state.selectedItemIds.indexOf(playlistItem.id) !== -1 ? 'active' : ''}>
												<td>
													<img src={playlistItem.inf.icon} alt={`Icon of ${playlistItem.inf.title}`} style={{ width: 50, height: 50, objectFit: 'cover' }} />
												</td>
												<td>{playlistItem.inf.title}</td>
												<td>{this.state.groups[this.state.groups.findIndex((group) => group.id === playlistItem.inf.groupId)].name}</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
							<div className="col-5 editor" style={{ height: '100%', overflow: 'auto' }}>
								{this.state.selectedItemIds.length > 0 ? (
									<Fragment>
										<h1>{this.state.selectedItemIds.length > 1 ? this.getPlaylistItemsByIds().map((item) => item.inf.title).join(', ') : this.getPlaylistItemsByIds().inf.title}</h1>
										
										{this.state.selectedItemIds.length === 1 && (
											<div className="form-group">
												<label htmlFor="name">Название:</label>
												<input type="text" className="form-control" id="name" value={this.getPlaylistItemsByIds().inf.title} onChange={this.setPlaylistItemName.bind(this)} />
											</div>
										)}
										<div className="form-group">
											<label htmlFor="group">Категория:</label>
											<select id="name" className="form-control" value={this.state.selectedItemIds.length > 1 ? this.state.groups[this.state.groups.findIndex((group) => group.id === this.getPlaylistItemsByIds()[0].inf.groupId)].id.toString() : this.state.groups[this.state.groups.findIndex((group) => group.id === this.getPlaylistItemsByIds().inf.groupId)].id.toString()} onChange={this.setPlaylistItemGroup.bind(this)}>
												{this.state.groups.map((group) => 
													<option value={group.id.toString()} key={group.id.toString()}>{group.name}</option>	
												)}
											</select>
										</div>
										{this.state.selectedItemIds.length === 1 && (
											<Fragment>
												<div className="form-group">
													<label htmlFor="iconURL">URL иконки:</label>
													<input type="text" className="form-control" id="iconURL" value={this.getPlaylistItemsByIds().inf.icon} onChange={this.setPlaylistItemIcon.bind(this)} />
												</div>
												<div className="form-group">
													<label htmlFor="addressURL">URL адресс канала</label>
													<input type="text" className="form-control" id="addressURL" value={this.getPlaylistItemsByIds().url} readOnly />
												</div>
											</Fragment>
										)}
									</Fragment>
								) : (
									<Fragment>
										<h1>Категории</h1>
										<ul>
											{this.state.groups.map((group) =>
												<li key={group.id.toString()}>
													<input className="form-control" type="text" value={group.name} name={group.id.toString()} onChange={this.setNewGroupName.bind(this)} />
												</li>
											)}
										</ul>
										<button onClick={this.addGroup.bind(this)} className="btn btn-outline-success">Добавить категорию</button>
									</Fragment>
								)}
							</div>
							<div className="col-2 save">
								<button className="btn btn-block btn-outline-success" onClick={this.saveData.bind(this)}>Сохранить</button>
								<button className="btn btn-block btn-outline-success" onClick={this.download.bind(this)}>Скачать</button>
							</div>
						</div>
					)}
				</Card>
			</div>
		);
	}
}

export default Admin;
