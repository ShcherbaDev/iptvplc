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
					name: 'Разное'
				}
			]
		};
	}

	async getEdemObj() {
		const request = await fetch('../../playlists/edem.xml');
		const response = await request.text();

		const parser = new window.DOMParser().parseFromString(response, 'text/xml');
		const playlistItemsNamesTags = parser.querySelectorAll('tv > channel > display-name');

		return playlistItemsNamesTags;
	}

	getPlaylistItemIcon(edemObj, playlistItemName) {
		for (let i = 0; i < edemObj.length; i += 1) {
			if (edemObj[i].innerHTML.toUpperCase().replace(' ', '') == playlistItemName.toUpperCase().replace(' ', '')) {
				return edemObj[i].parentNode.querySelector('icon').getAttribute('src');
			}
		}

		return './static/images/nopic.jpg';
	}

	async componentDidMount() {
		const storage = localStorage || window.localStorage;

		if (storage.getItem('channels') === null) {
			const regex = /#EXTINF:(.*?),(.*?)\n#EXTGRP(.*?)\n(.*)/gm;
			const str = `#EXTM3U url-tvg="http://epg.it999.ru/edem.xml.gz"
#EXTINF:-1,Bridge TV
#EXTGRP:Музыка
http://ott-cdn.ucom.am/s34/04.m3u8
#EXTINF:-1,Discovery
#EXTGRP:Познавательные
http://hls-v3-spbtv.msk.spbtv.com/for_spb/msk/ipv3/154.m3u8
#EXTINF:-1,Bridge TV Русский хит
#EXTGRP:Музыка
http://ott-cdn.ucom.am/s78/04.m3u8
#EXTINF:-1,Fine Living
#EXTGRP:Познавательные
http://ott-cdn.ucom.am/s51/04.m3u8
#EXTINF:-1,Food Network
#EXTGRP:Познавательные
http://ott-cdn.ucom.am/s18/04.m3u8
#EXTINF:-1,MCM TOP
#EXTGRP:Музыка
http://ott-cdn.ucom.am/s49/04.m3u8
#EXTINF:-1,Здоровье
#EXTGRP:Общие
http://ott-cdn.ucom.am/s90/04.m3u8
#EXTINF:-1,TV 1000 Action
#EXTGRP:Кино
http://ott-cdn.ucom.am/s91/04.m3u8
#EXTINF:-1,Дорама
#EXTGRP:Кино
http://ott-cdn.ucom.am/s95/04.m3u8
#EXTINF:-1,Tiji
#EXTGRP:Детские
http://ott-cdn.ucom.am/s59/04.m3u8
#EXTINF:-1,Viasat History
#EXTGRP:Познавательные
http://ott-cdn.ucom.am/s70/04.m3u8
#EXTINF:-1,стс love
#EXTGRP:Кино
http://ott-cdn.ucom.am/s52/04.m3u8
#EXTINF:-1,Победа
#EXTGRP:Кино
http://ott-cdn.ucom.am/s47/04.m3u8
#EXTINF:-1,Рыжий
#EXTGRP:Детские
http://ott-cdn.ucom.am/s57/04.m3u8
#EXTINF:-1,Сарафан
#EXTGRP:Украина
http://ott-cdn.ucom.am/s38/04.m3u8
#EXTINF:-1,ТНТ4
#EXTGRP:Развлекательные
http://ott-cdn.ucom.am/s100/04.m3u8
#EXTINF:-1,Приключения HD
#EXTGRP:Общие
http://ott-cdn.ucom.am/s99/04.m3u8
#EXTINF:-1,Russia Today
#EXTGRP:Общие
http://ott-cdn.ucom.am/s96/04.m3u8
#EXTINF:-1,Киноман Armenia Tv
#EXTGRP:Кино
http://ott-cdn.ucom.am/s66/04.m3u8
#EXTINF:-1,Filmzone Armenia Tv
#EXTGRP:Кино
http://ott-cdn.ucom.am/s48/04.m3u8
#EXTINF:-1,Kinoman Armenia Tv
#EXTGRP:Кино
http://ott-cdn.ucom.am/s94/04.m3u8
#EXTINF:-1,Premium 1 Armenia Tv
#EXTGRP:Общие
http://ott-cdn.ucom.am/s83/04.m3u8
#EXTINF:-1,ДОМАШНИЙ
#EXTGRP:Кино
http://ott-cdn.ucom.am/s88/04.m3u8
#EXTINF:-1,SENTANA SPORT
#EXTGRP:Спорт
http://ott-cdn.ucom.am/s81/04.m3u8
#EXTINF:-1,Fast & Fun BOX
#EXTGRP:Общие
http://ott-cdn.ucom.am/s79/04.m3u8
#EXTINF:-1,Охотник и рыболов HD
#EXTGRP:Спорт
http://ott-cdn.ucom.am/s62/04.m3u8
#EXTINF:-1,ТВЦ
#EXTGRP:Общие
http://ott-cdn.ucom.am/s54/04.m3u8
#EXTINF:-1,ПЯТНИЦА
#EXTGRP:Общие
http://ott-cdn.ucom.am/s50/04.m3u8
#EXTINF:-1,Киноменю HD
#EXTGRP:Кино
http://62.76.26.81:8081/hdmedia/menu/playlist.m3u8
#EXTINF:-1,ТНТ
#EXTGRP:Общие
http://vs350.vcdn.biz/1ff4118dc0fefcbd3ce5ae5fdf2fc482_megogo/vod/fs/o/40500701/u_sid/0/u_uid/0/u_vod/0/u_device/cms_html5/u_srvc/28561/type.live/chunklist-sid333265525-b2490000.m3u8
#EXTINF:-1,СТС
#EXTGRP:Общие
http://vs310.vcdn.biz/f6681bf4f562aec018b39c4bf3316dc6_megogo/vod/fs/o/40256721/u_sid/0/u_uid/0/u_vod/0/u_device/cms_html5/u_srvc/28561/type.live/chunklist-sid985762079-b2490000.m3u8
#EXTINF:-1,Россия 24
#EXTGRP:Общие
http://gorod.tv/s/live/7/178.141.142.2/1556188519397/0.m3u8
#EXTINF:-1,ТНТ4
#EXTGRP:Общие
http://ott-cdn.ucom.am/s100/index.m3u8
#EXTINF:-1,Карусель
#EXTGRP:Общие
http://gorod.tv/s/live/8/178.141.142.2/1556188519397/0.m3u8
#EXTINF:-1,Шокирующее HD
#EXTGRP:Кино
http://91.223.105.236:8081/hlsx/472/472.m3u8?id=1188&p=87e0c783e9b31451
#EXTINF:-1,Комедийное HD
#EXTGRP:Кино
http://91.223.105.236:8081/hlsx/473/473.m3u8?id=1188&p=12326fa256d9bf86
#EXTINF:-1,КиноХит
#EXTGRP:Кино
http://77.245.98.22:8000/play/321/index.m3u8
#EXTINF:0,Setanta Sport
#EXTGRP:Общие
http://ott-cdn.ucom.am/s81/index.m3u8
#EXTINF:-1,Setanta Sport HD
#EXTGRP:Общие
http://92.46.127.146:8080/SetantaSport/index.m3u8
#EXTINF:-1,Setanta Sport Plus HD
#EXTGRP:Общие
http://92.46.127.146:8080/SetantaSportPlus/index.m3u8
#EXTINF:-1,DTX
#EXTGRP:Познавательные
http://182.73.122.74:10005/bysid/407
#EXTINF:-1,КиноМеню HD
#EXTGRP:Кино
http://62.76.26.81:8081/hdmedia/menu/playlist.m3u8
#EXTINF:-1,112 Україна
#EXTGRP:Украина
http://api.tv.ipnet.ua/api/v1/manifest/1442908080.m3u8?codec=mpeg4
#EXTINF:-1,112 Україна HD
#EXTGRP:Украина
http://app.live.112.events/hls-ua/112hd_mid/index.m3u8
#EXTINF:-1,112 Україна [FHD]
#EXTGRP:Украина
http://app.live.112.events/hls-ua/112hd_hi/index.m3u8
#EXTINF:-1,24 канал
#EXTGRP:Украина
http://api.tv.ipnet.ua/api/v1/manifest/1293298050.m3u8?codec=mpeg4
#EXTINF:-1,24 канал HD
#EXTGRP:Украина
http://streamvideol1.luxnet.ua/news24/smil:news24.stream.smil/chunklist_b1328800.m3u8
#EXTINF:-1,34 канал
#EXTGRP:Украина
http://api.tv.ipnet.ua/api/v1/manifest/2118742463.m3u8?codec=mpeg4
#EXTINF:-1,34 канал
#EXTGRP:Украина
http://streamvideol.luxnet.ua/34ua/34ua.stream/playlist.m3u8
#EXTINF:-1,360 HD
#EXTGRP:HD
http://360tv-cdn.facecast.io/360/channel2/1.m3u8
#EXTINF:-1,4 канал Україна
#EXTGRP:Украина
http://cdn.vsnw.net:8081/interradio/480i.m3u8
#EXTINF:-1,4 канал Україна HD
#EXTGRP:Украина
http://cdn.vsnw.net:8081/interradio/720i.m3u8
#EXTINF:-1,4 канал Україна [FHD]
#EXTGRP:Украина
http://cdn.vsnw.net:8081/interradio/1080i.m3u8
#EXTINF:-1,43 КИНО канал HD
#EXTGRP:HD
http://sochi-strk.ru:1936/strk/43Kanal.stream/playlist.m3u8
#EXTINF:-1,5 канал
#EXTGRP:Украина
http://api.tv.ipnet.ua/api/v1/manifest/1293299450.m3u8?codec=mpeg4
#EXTINF:-1,7 TV
#EXTGRP:Общие
http://v1.proofix.ru/live-tv7/stream1/playlist.m3u8
#EXTINF:-1,8 Канал
#EXTGRP:Общие
http://v1.proofix.ru/live-tv8/stream1/playlist.m3u8
#EXTINF:-1,a2
#EXTGRP:Кино
http://sc.id-tv.kz/A2_38_39.m3u8
#EXTINF:-1,ACB TV
#EXTGRP:Общие
http://acbtv.vintera.tv:8081/acbtv/acbtv_stream/playlist.m3u8
#EXTINF:-1,ATR
#EXTGRP:Украина
http://stream.atr.ua/atr/live/index.m3u8
#EXTINF:-1,CGTN Русский
#EXTGRP:Общие
http://live.cgtn.com/1000r/prog_index.m3u8
#EXTINF:-1,DW TV English
#EXTGRP:Познавательные
http://dwstream4-lh.akamaihd.net/i/dwstream4_live@131329/index_1_av-b.m3u8
#EXTINF:-1,Deejay TV
#EXTGRP:Общие
http://deejay_tv-lh.akamaihd.net/i/DeejayTv_1@129866/index_600_av-p.m3u8
#EXTINF:-1,France 24 (ENG)
#EXTGRP:Общие
http://f24hls-i.akamaihd.net/hls/live/221147/F24_EN_HI_HLS/master_2000.m3u8
#EXTINF:-1,HD Media 3D
#EXTGRP:HD
http://62.76.26.81:8081/hdmedia/hdmedia_3d/playlist.m3u8
#EXTINF:-1,Heavy Metal TV
#EXTGRP:Музыка
http://72.211.19.145:1935/hmtv/myStream/playlist.m3u8
#EXTINF:-1,Hit Music Channel
#EXTGRP:Музыка
http://1mstream.digicable.hu/hitmusic/hitmusic.m3u8
#EXTINF:-1,Kazakh TV
#EXTGRP:Общие
http://212.8.233.150:8081/kazahtv/stream_kz/playlist.m3u8
#EXTINF:-1,Kazakh TV (KZ)
#EXTGRP:Общие
http://212.8.233.150:8081/kazahtv/stream_ru/playlist.m3u8
#EXTINF:-1,Kino 24
#EXTGRP:Кино
http://82.193.71.93/Kino24LV/video.m3u8
#EXTINF:-1,LALE
#EXTGRP:Украина
http://stream.atr.ua/lale//live/index.m3u8
#EXTINF:-1,Luxury HD
#EXTGRP:HD
http://nano.teleservice.su:8080/hls/luxury.m3u8
#EXTINF:-1,M2O TV
#EXTGRP:Музыка
http://m2otv-lh.akamaihd.net/i/m2oTv_1@186074/index_600_av-p.m3u8
#EXTINF:-1,MostVideo TV HD
#EXTGRP:Украина
http://wow.stib.com.ua:1935/tv/ch1/playlist.m3u8
#EXTINF:-1,MostVideo TV HD
#EXTGRP:HD
http://w4.mostvideo.tv/tv/ch1.m3u8
#EXTINF:-1,Music Box UA
#EXTGRP:Украина
http://212.26.132.86/hls/mb_ua_2500.m3u8
#EXTINF:-1,Nano TV
#EXTGRP:Познавательные
http://nano.teleservice.su:8080/hls/nano.m3u8
#EXTINF:-1,ON TV (KZ)
#EXTGRP:Общие
http://sc.id-tv.kz/ON_TV_38_39.m3u8
#EXTINF:-1,OTV Music
#EXTGRP:Украина
http://api.tv.ipnet.ua/api/v1/manifest/1293297500.m3u8?codec=mpeg4
#EXTINF:-1,RU.TV
#EXTGRP:Общие
https://rutv.gcdn.co/streams/1410_95/480n/index.m3u8
#EXTINF:-1,Radio 105 Network TV
#EXTGRP:Музыка
http://tv.105.net:1935/live/105Test3/playlist.m3u8
#EXTINF:-1,Radio Monte Carlo TV
#EXTGRP:Музыка
http://tv.105.net:1935/live/rmc3/playlist.m3u8
#EXTINF:-1,Russian Music Box 
#EXTGRP:Музыка
http://serv25.vintera.tv:8081/test/rusmusbox/playlist.m3u8
#EXTINF:-1,Shopping Live
#EXTGRP:Общие
http://shoppinglive.mediacdn.ru/sr1/shoppinglive/playlist.m3u8
#EXTINF:-1,TV8 Moldova
#EXTGRP:Общие
http://live.cdn.tv8.md/TV7/video1.m3u8?token=1
#EXTINF:-1,TVM Channel
#EXTGRP:Общие
http://149.154.68.132:8081/HOLA/stream/playlist.m3u8
#EXTINF:-1,Top Shop TV
#EXTGRP:Общие
http://tv-topshop.netrack.ru/hls/topshop.m3u8
#EXTINF:-1,UA TV HD
#EXTGRP:Украина
http://ua-tv-hls2.cosmonova.net.ua/hls/ua-tv_ua_mid/index.m3u8
#EXTINF:-1,UA:Крим
#EXTGRP:Украина
http://api.tv.ipnet.ua/api/v1/manifest/2118742409.m3u8?codec=mpeg4
#EXTINF:-1,UA:Перший
#EXTGRP:Украина
http://api.tv.ipnet.ua/api/v1/manifest/871803891.m3u8?codec=mpeg4
#EXTINF:-1,Арис 24
#EXTGRP:Общие
http://195.191.78.200:8100/hls/aris24_hls.m3u8
#EXTINF:-1,Арис 24
#EXTGRP:Общие
http://serv25.vintera.tv:8081/test/aris/playlist.m3u8
#EXTINF:-1,Архыз 24 HD
#EXTGRP:HD
http://live.mediacdn.ru/sr1/arhis24/chunklist_b2396000.m3u8
#EXTINF:-1,Астрахань 24 HD
#EXTGRP:HD
http://cdn-01.bonus-tv.ru:8080/astrakhan24_edge/tracks-v1a1/index.m3u8
#EXTINF:-1,Башкирское спутниковое телевидение
#EXTGRP:Общие
http://bsttv.bonus-tv.ru:80/cdn/bst/tracks-v1a1/index.m3u8
#EXTINF:-1,БелРос
#EXTGRP:Общие
http://live2.mediacdn.ru/sr1/tro/playlist.m3u8
#EXTINF:-1,Бокс ТВ HD
#EXTGRP:HD
http://hls.boxingtvru.cdnvideo.ru/boxingtvru/boxingtvru_hq/playlist.m3u8
#EXTINF:-1,Ветта 24
#EXTGRP:Общие
http://serv24.vintera.tv:8081/vetta/vetta_office/playlist.m3u8
#EXTINF:-1,Витрина ТВ
#EXTGRP:Общие
http://v1.proofix.ru/live-vitrina-tv/stream1-ru/playlist.m3u8
#EXTINF:-1,Вкусное ТВ
#EXTGRP:Общие
http://live.planeta-online.tv:1935/public/channel_133/playlist.m3u8
#EXTINF:-1,Волгоград 24
#EXTGRP:Общие
http://serv24.vintera.tv:8081/volga24/volgograd24/playlist.m3u8
#EXTINF:-1,Горная Страна ТВ HD
#EXTGRP:HD
http://hls-sneg-pull2.cdnvideo.ru/sneg-pull2/KTS/playlist.m3u8
#EXTINF:-1,Грозный
#EXTGRP:Общие
http://live2.mediacdn.ru/sr1/grozny/chunklist_b1498000.m3u8
#EXTINF:-1,Громадське
#EXTGRP:Украина
http://api.tv.ipnet.ua/api/v1/manifest/2118742457.m3u8?codec=mpeg4
#EXTINF:-1,Громадське [FHD]
#EXTGRP:Украина
http://94.45.135.158:1935/live/HrBroadcast/playlist.m3u8
#EXTINF:-1,Дагестан ТВ
#EXTGRP:Общие
http://dagestan.mediacdn.ru/cdn/dagestan/tracks-v3a1/index.m3u8
#EXTINF:-1,Дагестан ТВ [FHD]
#EXTGRP:HD
http://dagestan.mediacdn.ru/cdn/dagestan/tracks-v2a1/index.m3u8
#EXTINF:-1,Дисконт
#EXTGRP:Общие
http://tvshops.bonus-tv.ru:80/cdn/discount/tracks-v1a1/index.m3u8
#EXTINF:-1,Euronews
#EXTGRP:Познавательные
http://evronovosti.mediacdn.ru/sr1/evronovosti/playlist.m3u8
#EXTINF:-1,Еко TV
#EXTGRP:Украина
http://api.tv.ipnet.ua/api/v1/manifest/1311963170.m3u8?codec=mpeg4
#EXTINF:-1,Ел Арна
#EXTGRP:Общие
http://sc.id-tv.kz/ElArna_38_39.m3u8
#EXTINF:-1,Еспресо
#EXTGRP:Украина
http://api.tv.ipnet.ua/api/v1/manifest/2007567821.m3u8?codec=mpeg4
#EXTINF:-1,Известия ТВ HD
#EXTGRP:HD
http://hls-igi.cdnvideo.ru/igi/igi_sq/playlist.m3u8
#EXTINF:-1,Ингушетия ТВ
#EXTGRP:Общие
http://live-ntk.cdnvideo.ru/ntk-publish/ntk.sdp/playlist.m3u8
#EXTINF:-1,Интер
#EXTGRP:Украина
https://edge3.iptv.macc.com.ua/img/inter_3/index.m3u8
#EXTINF:-1,К1
#EXTGRP:Украина
http://109.68.40.67/life/k1_3/index.m3u8
#EXTINF:-1,КРТ
#EXTGRP:Украина
http://api.tv.ipnet.ua/api/v1/manifest/1298864660.m3u8?codec=mpeg4
#EXTINF:-1,КТК
#EXTGRP:Общие
http://sc.id-tv.kz/KTK_38_39.m3u8
#EXTINF:-1,Кавказ 24
#EXTGRP:Общие
http://serv30.vintera.tv:8081/kavkaz24/kavkaz24_stream/playlist.m3u8
#EXTINF:-1,Київ
#EXTGRP:Украина
http://hls-kyivtv.cdnvideo.ru/kyivtv/kyivtv.sdp/playlist.m3u8
#EXTINF:-1,Красная линия ТВ
#EXTGRP:Познавательные
http://kprf-htlive.cdn.ngenix.net/live/_definst_/stream_high/playlist.m3u8
#EXTINF:-1,Кубань 24 Орбита
#EXTGRP:Общие
https://stream.kuban24.tv:1500/hls/stream.m3u8
#EXTINF:-1,Кузбасс 24
#EXTGRP:Общие
http://serv30.vintera.tv:8081/sibirj/kuzbass24/playlist.m3u8
#EXTINF:-1,Курай ТВ
#EXTGRP:Музыка
http://bsttv.bonus-tv.ru:80/cdn/kurai/tracks-v1a1/index.m3u8
#EXTINF:-1,Липецкое Время
#EXTGRP:Познавательные
http://serv25.vintera.tv:8081/liptime/liptime/playlist.m3u8
#EXTINF:-1,Магия Кухни ТВ
#EXTGRP:Общие
http://sc.id-tv.kz/MagiyaKuhni_38_39.m3u8
#EXTINF:-1,Малятко
#EXTGRP:Украина
http://api.tv.ipnet.ua/api/v1/manifest/1311963260.m3u8?codec=mpeg4
#EXTINF:-1,Мир (HD)
#EXTGRP:HD
http://hls.mirtv.cdnvideo.ru/mirtv-parampublish/mirtv_2500/playlist.m3u8
#EXTINF:-1,Мир 24
#EXTGRP:Общие
http://sc.id-tv.kz/Mir24_38_39.m3u8
#EXTINF:-1,Мир 24 HD
#EXTGRP:HD
http://hls.mirtv.cdnvideo.ru/mirtv-parampublish/mir24_2500/playlist.m3u8
#EXTINF:-1,Мир Premium HD
#EXTGRP:HD
http://hls.mirtv.cdnvideo.ru/mirtv-parampublish/hd/playlist.m3u8
#EXTINF:-1,Москва 24
#EXTGRP:Общие
http://a3569458063-s26881.cdn.ngenix.net/live/smil:m24.smil/chunklist_b1600000.m3u8
#EXTINF:-1,Моя Планета
#EXTGRP:Познавательные
http://a3569458063-s26881.cdn.ngenix.net/live/smil:mplan.smil/chunklist_b1600000.m3u8
#EXTINF:-1,Мультимания
#EXTGRP:Детские
http://82.193.71.93/MultimaniaLV/video.m3u8
#EXTINF:-1,НТВ Молдова
#EXTGRP:Общие
http://93.115.137.166/hls/ntvm.m3u8
#EXTINF:-1,НТН
#EXTGRP:Украина
https://edge3.iptv.macc.com.ua/img/ntn_3/index.m3u8
#EXTINF:-1,Наше TV
#EXTGRP:Общие
http://hls-01-nashetv.magonet.ru/nashetv/live/index.m3u8
#EXTINF:-1,Новое Телевидение (KZ)
#EXTGRP:Общие
http://sc.id-tv.kz/New_Television_38_39.m3u8
#EXTINF:-1,Новый Мир
#EXTGRP:Общие
http://stream.studio360.tv/nw/nw_576p/playlist.m3u8
#EXTINF:-1,ОНТ.BY
#EXTGRP:Общие
http://stream.ont.by:1935/ont/live576p/playlist.m3u8
#EXTINF:-1,ОТР [FHD]
#EXTGRP:HD
http://live-otronline.cdnvideo.ru/otr-decklink/otr/playlist.m3u8
#EXTINF:-1,Осетия-Ирыстон
#EXTGRP:Познавательные
http://now03.eaglecdn.com/stream_transcoded_720/irystontv_irystontvstream1_hi/index.m3u8
#EXTINF:-1,Открытый [FHD]
#EXTGRP:HD
http://hls.opentv.online/7200k/open_7200k.m3u8
#EXTINF:-1,Первый Балтийский Музыка
#EXTGRP:Музыка
https://streamer5.tvdom.tv/in/tvdom/tracks-v1a1/index.m3u8
#EXTINF:-1,Перший дiловий
#EXTGRP:Украина
http://pershij-dlovij-hls3.cosmonova.net.ua/hls/pershij-dlovij_ua_hi/index.m3u8
#EXTINF:-1,Первый канал "Евразия"
#EXTGRP:Общие
http://sc.id-tv.kz/1KanalEvraziya_38_39.m3u8
#EXTINF:-1,Пингвин Лоло
#EXTGRP:Детские
http://82.193.71.93/LoLoRuSattelite/video.m3u8
#EXTINF:-1,Премьера TV (Трейлеры)
#EXTGRP:Кино
http://live.planeta-online.tv:1935/public/channel_5/playlist.m3u8
#EXTINF:-1,Прямий HD
#EXTGRP:Украина
http://prm-hls1.cosmonova.net.ua/hls/prm_ua_hi/index.m3u8
#EXTINF:-1,РБК ТВ
#EXTGRP:Общие
http://online.video.rbc.ru/online/rbctv_576p/index.m3u8
#EXTINF:-1,Рада
#EXTGRP:Украина
http://api.tv.ipnet.ua/api/v1/manifest/1312714970.m3u8?codec=mpeg4
#EXTINF:-1,Рен ТВ
#EXTGRP:Общие
http://ad-hls-rentv.cdnvideo.ru/ren/smil:ren.smil/playlist.m3u8
#EXTINF:-1,Россия 1 HD
#EXTGRP:HD
http://a3569458063-s26881.cdn.ngenix.net/hls/russia_hd/playlist_4.m3u8
#EXTINF:-1,Россия Культура
#EXTGRP:Познавательные
http://a3569458063-s26881.cdn.ngenix.net/hls/russia_k/playlist_3.m3u8
#EXTINF:-1,Ростов-папа HD
#EXTGRP:HD
http://hls-rostovpapa.cdnvideo.ru/rostovpapa/rostovpapa.sdp/playlist.m3u8
#EXTINF:-1,СTV.BY
#EXTGRP:Общие
http://212.98.171.116/HLS/ctvby/playlist.m3u8
#EXTINF:-1,СТРК HD
#EXTGRP:HD
http://sochi-strk.ru:1936/strk/strk.stream/playlist.m3u8
#EXTINF:-1,Санкт-Петербург
#EXTGRP:Общие
http://stream2.topspb.tv:1935/live/smil:live.smil/chunklist_b1596000.m3u8
#EXTINF:-1,Свое ТВ (Ставрополь)
#EXTGRP:Общие
http://serv24.vintera.tv:8081/svoetv/stvsd/playlist.m3u8
#EXTINF:-1,Сказки Зайки
#EXTGRP:Детские
http://skazki.vintera.tv:8081/skazki/zaj/playlist.m3u8
#EXTINF:-1,Смайлик ТВ HD
#EXTGRP:HD
http://62.32.67.187:1935/WEB_Smilik/Smilik.stream/playlist.m3u8
#EXTINF:-1,Сочи 24 HD
#EXTGRP:HD
http://serv30.vintera.tv:8081/sochi/maks24hd/playlist.m3u8
#EXTINF:-1,Союз
#EXTGRP:Общие
http://hls-tvsoyuz.cdnvideo.ru/tvsoyuz/soyuz/playlist.m3u8
#EXTINF:-1,TD 42
#EXTGRP:Общие
http://sc.id-tv.kz/TDK-42_38_39.m3u8
#EXTINF:-1,Твое ТВ (KZ)
#EXTGRP:Общие
http://sc.id-tv.kz/TvoeTV_38_39.m3u8
#EXTINF:-1,Точка ТВ
#EXTGRP:Украина
http://serv24.vintera.tv:8081/tochka/tochkatv/playlist.m3u8
#EXTINF:-1,ЧП.INFO
#EXTGRP:Украина
http://109.68.40.67/life/magnolia_3/index.m3u8
#EXTINF:-1,Шансон ТВ
#EXTGRP:Музыка
http://hls.shansontv.cdnvideo.ru/shansontv/shansontv_hq.sdp/playlist.m3u8
#EXTINF:-1,Наука 2.0
#EXTGRP:Познавательные
http://ott-cdn.ucom.am/s98/index.m3u8
#EXTINF:-1,Nickelodeon
#EXTGRP:Детские
http://hls-v3-spbtv.msk.spbtv.com/for_spb/msk/ipv3/460.m3u8
#EXTINF:-1,1+1
#EXTGRP:Украина
http://kv-3ln-n01.ollcdn.net/hls-tv/18/128147972228ef43d29d88c5490c0005/5ca630d7/oneplusone/oneplusone.m3u8
#EXTINF:-1,ТЕТ
#EXTGRP:Украина
http://kv-3ln-n01.ollcdn.net/hls-tv/18/128147972228ef43d29d88c5490c0005/5ca630d7/tet/tet.m3u8`;

			let result = [];

			str.match(regex).forEach((item) => {
				result.push(/^#EXTINF:(\1-?[0-9]*),(\2.*)\n#EXTGRP:(\3.*)\n(\4.*)$/gm.exec(item));
			});

			let finalResult = [];

			const edem = await this.getEdemObj();
			result.forEach((item, index) => {
				const playlistItemIcon = this.getPlaylistItemIcon(edem, item[2]);

				if (
					this.state.groups.findIndex((group) => group.name === item[3]) === -1
				) {
					this.setState({
						groups: [
							...this.state.groups,
							{
								id: this.state.groups.length,
								name: item[3]
							}
						]
					})
				}

				finalResult.push(
					{
						id: index,
						inf: {
							title: item[2],
							groupId: this.state.groups[this.state.groups.findIndex((group) => group.name === item[3])].id,
							duration: parseInt(item[1], 10),
							icon: playlistItemIcon
						},
						url: item[4]
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
