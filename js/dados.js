'use strict';

function ordemAscendente(array, propriedade) {
	return [...array].sort(function (a, b) {
		return (
			(a[propriedade] > b[propriedade])?  1 :
			(a[propriedade] < b[propriedade])? -1 : 0
		)
	});
}

function ordemDescendente(array, propriedade) {
	return [...array].sort(function (a, b) {
		return (
			(a[propriedade] > b[propriedade])? -1 :
			(a[propriedade] < b[propriedade])?  1 : 0
		)
	});
}

function tipoAudio(idAudio) {
	return (
		busqueAudioEmEfeitosSonoros(idAudio) ||
		busqueAudioEmVinhetas(idAudio) ||
		busqueAudioEmComerciais(idAudio) ||
		busqueAudioEmProgramas(idAudio) ||
		busqueAudioEmMusicas(idAudio) || null
	);
}

function busqueAudioEmEfeitosSonoros(idAudio) {
	const e = busqueEfeitosSonoros().find(e => e.audio === idAudio);
	return (!e)? e : { nome: 'efeito-sonoro', audio: e };
}

function busqueAudioEmVinhetas(idAudio) {
	const v = busqueVinhetas().find(v => v.audio === idAudio);
	return (!v)? v : { nome: 'vinheta', audio: v };
}

function busqueAudioEmComerciais(idAudio) {
	const c = busqueComerciais().find(c => c.audio === idAudio);
	return (!c)? c : { nome: 'comercial', audio: c };
}

function busqueAudioEmProgramas(idAudio) {
	const p = busqueProgramas().find(m => m.audio === idAudio);
	return (!p)? p : { nome: 'programa', audio: p };
}

function busqueAudioEmMusicas(idAudio) {
	const m = busqueMusicas().find(e => e.audio === idAudio);
	return (!m)? m : { nome: 'musica', audio: m };
}

function tempoTotalPlaylist(idPlaylist) {
	return busqueSequencias()
		.filter(s => s.playlist === idPlaylist)
		.reduce((total, atual) => { return total + duracaoAudio(atual.audio)}, 0);
}

function busqueEntidade(array, id) {
	return array.find(i => i.id == id);
}

function busqueSequenciasPlaylist(idPlaylist) {
	return busqueSequencias().filter(s => s.playlist === idPlaylist);
}

function deleteSequenciasPlaylist(idPlaylist) {
	window.localStorage.setItem(
		'sequencia',
		JSON.stringify(
			busqueSequencias().filter(s => s.playlist !== idPlaylist)
		)
	);
}

function deleteAudioPlaylist(idAudio, idPlaylist) {
	const sequencias = busqueSequenciasPlaylist(idPlaylist)
		.filter(s => s.audio !== idAudio);
	deleteSequenciasPlaylist(idPlaylist);
	if (sequencias.length > 0) {
		let ordem = 0;
		for (const s of ordemAscendente(sequencias, 'ordem')) {
			s.ordem = ++ordem;
		}
		salve('sequencia', busqueSequencias(), sequencias);
	} else {
		deleteEntidade('playlist', busquePlaylists(), idPlaylist);
	}
}

function busque(propriedade, array, id) {
	return busqueEntidade(array, id)[propriedade];
}

function deleteEntidade(tabela, array, id) {
	window.localStorage.setItem(
		tabela,
		JSON.stringify(array.filter(i => i.id !== id))
	);
}

function salve(tabela, array, valores) {
	window.localStorage.setItem(
		tabela,
		JSON.stringify(array.concat(valores))
	);
}

function duracaoAudio(idAudio) {
	duracaoAudio.id2duracao = (
		duracaoAudio.id2duracao ||
		new Map(busqueAudios().map(a => [a.id, a.duracao]))
	);
	let duracao = duracaoAudio.id2duracao.get(idAudio);
	if (!duracao) {
		const audio = busqueAudios().find(a => a.id === idAudio);
		if (audio) {
			duracao = audio.duracao;
			duracaoAudio.id2duracao.set(idAudio, duracao);
		}
	}
	return duracao;
}

function artistasMusica(musica) {
	return [musica.artista].concat(
		busqueParticipacoes()
			.filter(p => p.musica === musica.id)
			.map(p => p.artista)
	);
}

function compositoresMusica(id) {
	return busqueComposicoes().filter(c =>
		c.musica === id).map(c => c.compositor
	);
}

function generosMusica(musica) {
	return [musica.genero].concat(
		busqueSubgeneros()
			.filter(s => s.musica === musica.id)
			.map(s => s.genero)
	);
}

function sequenciasPlaylist(idPlaylist) {
	return busqueSequencias().filter(s => s.playlist === idPlaylist);
}

function playlistsAudio(idAudio) {
	return busquePlaylists()
		.filter(p => sequenciasPlaylist(p.id).some(s => s.audio === idAudio));
}

function busqueArtistasMusicas() {
	return [
		...new Set(
			busqueMusicas().map(m => m.artista).concat(
				busqueParticipacoes().map(p => p.artista)
			)
		)
	];
}

function busqueCompositores() {
	return [...new Set(busqueComposicoes().map(c => c.compositor))];
}

function busqueArtistasPorIds(ids) {
	return busqueArtistas().filter(a => ids.includes(a.id));
}

function proximoId(tabela) {
	const item = 'proximoId';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, `{"artista":17,"playlist":18,"musica":79,"audio":103,"genero":14,"gravadora":6,"vinheta":6,"efeitoSonoro":6}`);
	}
	const proximo = JSON.parse(window.localStorage.getItem(item));
	proximo[tabela]++;
	window.localStorage.setItem(item, JSON.stringify(proximo));
	return proximo[tabela];
}

function busqueParticipacoes() {
	const item = 'participacao';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"musica":3,"artista":2},{"musica":8,"artista":4},{"musica":8,"artista":5},{"musica":27,"artista":7},{"musica":28,"artista":9},{"musica":53,"artista":13},{"musica":57,"artista":14}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}

function busqueArtistas() {
	const item = 'artista';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"id":1,"nome":"SchoolBoy Q"},{"id":2,"nome":"Kendrick Lamar"},{"id":3,"nome":"Ricci Riera"},{"id":4,"nome":"Tyler, the Creator"},{"id":5,"nome":"Kurupt"},{"id":6,"nome":"Djonga"},{"id":7,"nome":"BK\'"},{"id":8,"nome":"Baco Exu do Blues"},{"id":9,"nome":"DJ KL Jay"},{"id":10,"nome":"Mukeka di Rato"},{"id":11,"nome":"Sandrinho"},{"id":12,"nome":"Fabio Mozine"},{"id":13,"nome":"Rodrigo Lima"},{"id":14,"nome":"Snoop Dogg"},{"id":15,"nome":"Electric Wizard"},{"id":16,"nome":"Jus Oborn"}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}

function busqueComposicoes() {
	const item = 'composicao';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"musica":1,"compositor":1},{"musica":2,"compositor":1},{"musica":3,"compositor":1},{"musica":3,"compositor":2},{"musica":3,"compositor":3},{"musica":4,"compositor":1},{"musica":5,"compositor":1},{"musica":6,"compositor":1},{"musica":7,"compositor":1},{"musica":8,"compositor":1},{"musica":8,"compositor":4},{"musica":9,"compositor":1},{"musica":10,"compositor":1},{"musica":11,"compositor":1},{"musica":12,"compositor":1},{"musica":13,"compositor":1},{"musica":14,"compositor":1},{"musica":15,"compositor":1},{"musica":16,"compositor":1},{"musica":17,"compositor":1},{"musica":18,"compositor":6},{"musica":19,"compositor":6},{"musica":20,"compositor":6},{"musica":21,"compositor":6},{"musica":22,"compositor":6},{"musica":23,"compositor":6},{"musica":24,"compositor":6},{"musica":25,"compositor":6},{"musica":26,"compositor":6},{"musica":27,"compositor":6},{"musica":27,"compositor":7},{"musica":28,"compositor":8},{"musica":29,"compositor":8},{"musica":30,"compositor":8},{"musica":31,"compositor":8},{"musica":32,"compositor":8},{"musica":33,"compositor":8},{"musica":34,"compositor":8},{"musica":35,"compositor":8},{"musica":36,"compositor":8},{"musica":37,"compositor":8},{"musica":38,"compositor":11},{"musica":38,"compositor":12},{"musica":39,"compositor":11},{"musica":39,"compositor":12},{"musica":40,"compositor":11},{"musica":40,"compositor":12},{"musica":41,"compositor":11},{"musica":41,"compositor":12},{"musica":42,"compositor":11},{"musica":42,"compositor":12},{"musica":43,"compositor":11},{"musica":43,"compositor":12},{"musica":44,"compositor":11},{"musica":44,"compositor":12},{"musica":45,"compositor":11},{"musica":45,"compositor":12},{"musica":46,"compositor":11},{"musica":46,"compositor":12},{"musica":47,"compositor":11},{"musica":47,"compositor":12},{"musica":48,"compositor":11},{"musica":48,"compositor":12},{"musica":49,"compositor":11},{"musica":49,"compositor":12},{"musica":50,"compositor":11},{"musica":50,"compositor":12},{"musica":51,"compositor":11},{"musica":51,"compositor":12},{"musica":52,"compositor":11},{"musica":52,"compositor":12},{"musica":53,"compositor":11},{"musica":53,"compositor":12},{"musica":54,"compositor":2},{"musica":55,"compositor":2},{"musica":56,"compositor":2},{"musica":57,"compositor":2},{"musica":58,"compositor":2},{"musica":59,"compositor":2},{"musica":60,"compositor":2},{"musica":61,"compositor":2},{"musica":62,"compositor":2},{"musica":63,"compositor":2},{"musica":64,"compositor":2},{"musica":65,"compositor":2},{"musica":66,"compositor":2},{"musica":67,"compositor":2},{"musica":68,"compositor":2},{"musica":69,"compositor":2},{"musica":70,"compositor":16},{"musica":71,"compositor":16},{"musica":72,"compositor":16},{"musica":73,"compositor":16},{"musica":74,"compositor":16},{"musica":75,"compositor":16},{"musica":76,"compositor":16},{"musica":77,"compositor":16},{"musica":78,"compositor":16}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}

function busquePlaylists() {
	const item = 'playlist';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"id":1,"nome":"Só Toca Chopin","programada_para":"2020-07-11 19:00:00"},{"id":2,"nome":"Músicas para Rachas de Triciclo","programada_para":"2020-07-11 21:00:00"},{"id":3,"nome":"Ornitorrincos Flamejantes 2000","programada_para":"2020-07-11 23:00:00"},{"id":4,"nome":"Hoje a Iguana Vai Piar","programada_para":"2020-07-12 01:00:00"},{"id":5,"nome":"DJ Chrissy Chris","programada_para":"2020-07-12 03:00:00"},{"id":6,"nome":"Nos Embalos da Quinta-Feira de Manhã","programada_para":"2020-07-12 07:00:00"},{"id":7,"nome":"Café da Manhã dos Campeões","programada_para":"2020-07-12 05:00:00"},{"id":8,"nome":"Inverno Eletrohits","programada_para":"2020-07-12 09:00:00"},{"id":9,"nome":"O Melhor do Melhor do Mundo dos Sonhos","programada_para":"2020-07-12 11:00:00"},{"id":10,"nome":"Clássicos do Acre","programada_para":"2020-07-12 13:00:00"},{"id":11,"nome":"Tornado 1955","programada_para":"2020-07-12 15:00:00"},{"id":12,"nome":"K-Bebop","programada_para":"2020-07-12 17:00:00"},{"id":13,"nome":"Toca y me Voy","programada_para":"2020-07-12 19:00:00"},{"id":14,"nome":"Sequência de Fibonacci","programada_para":"2020-07-12 21:00:00"},{"id":15,"nome":"DJ Kondratas Lituano","programada_para":"2020-07-12 23:00:00"},{"id":16,"nome":"Canções para Dormir no Volante","programada_para":"2020-07-13 01:00:00"},{"id":17,"nome":"Trilha Sonora do Chaves","programada_para":"2020-07-13 03:00:00"}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}

function busqueSequencias() {
	const item = 'sequencia';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"playlist":1,"audio":8,"ordem":1},{"playlist":1,"audio":43,"ordem":2},{"playlist":1,"audio":82,"ordem":3},{"playlist":1,"audio":93,"ordem":4},{"playlist":1,"audio":32,"ordem":5},{"playlist":1,"audio":29,"ordem":6},{"playlist":1,"audio":95,"ordem":7},{"playlist":1,"audio":66,"ordem":8},{"playlist":1,"audio":71,"ordem":9},{"playlist":1,"audio":13,"ordem":10},{"playlist":1,"audio":101,"ordem":11},{"playlist":1,"audio":63,"ordem":12},{"playlist":1,"audio":70,"ordem":13},{"playlist":1,"audio":58,"ordem":14},{"playlist":1,"audio":55,"ordem":15},{"playlist":1,"audio":49,"ordem":16},{"playlist":2,"audio":73,"ordem":1},{"playlist":2,"audio":33,"ordem":2},{"playlist":2,"audio":72,"ordem":3},{"playlist":2,"audio":28,"ordem":4},{"playlist":2,"audio":38,"ordem":5},{"playlist":2,"audio":90,"ordem":6},{"playlist":2,"audio":97,"ordem":7},{"playlist":2,"audio":50,"ordem":8},{"playlist":2,"audio":68,"ordem":9},{"playlist":2,"audio":29,"ordem":10},{"playlist":2,"audio":47,"ordem":11},{"playlist":2,"audio":64,"ordem":12},{"playlist":2,"audio":65,"ordem":13},{"playlist":2,"audio":95,"ordem":14},{"playlist":3,"audio":68,"ordem":1},{"playlist":3,"audio":89,"ordem":2},{"playlist":3,"audio":1,"ordem":3},{"playlist":3,"audio":55,"ordem":4},{"playlist":3,"audio":42,"ordem":5},{"playlist":3,"audio":57,"ordem":6},{"playlist":3,"audio":92,"ordem":7},{"playlist":3,"audio":66,"ordem":8},{"playlist":3,"audio":100,"ordem":9},{"playlist":3,"audio":32,"ordem":10},{"playlist":3,"audio":50,"ordem":11},{"playlist":3,"audio":79,"ordem":12},{"playlist":3,"audio":46,"ordem":13},{"playlist":3,"audio":97,"ordem":14},{"playlist":3,"audio":63,"ordem":15},{"playlist":3,"audio":67,"ordem":16},{"playlist":3,"audio":30,"ordem":17},{"playlist":4,"audio":99,"ordem":1},{"playlist":4,"audio":44,"ordem":2},{"playlist":4,"audio":55,"ordem":3},{"playlist":4,"audio":56,"ordem":4},{"playlist":4,"audio":45,"ordem":5},{"playlist":4,"audio":68,"ordem":6},{"playlist":4,"audio":1,"ordem":7},{"playlist":4,"audio":28,"ordem":8},{"playlist":4,"audio":30,"ordem":9},{"playlist":4,"audio":35,"ordem":10},{"playlist":4,"audio":74,"ordem":11},{"playlist":4,"audio":46,"ordem":12},{"playlist":4,"audio":36,"ordem":13},{"playlist":5,"audio":68,"ordem":1},{"playlist":5,"audio":5,"ordem":2},{"playlist":5,"audio":98,"ordem":3},{"playlist":5,"audio":80,"ordem":4},{"playlist":5,"audio":84,"ordem":5},{"playlist":5,"audio":29,"ordem":6},{"playlist":5,"audio":78,"ordem":7},{"playlist":5,"audio":91,"ordem":8},{"playlist":5,"audio":35,"ordem":9},{"playlist":6,"audio":54,"ordem":1},{"playlist":6,"audio":80,"ordem":2},{"playlist":6,"audio":88,"ordem":3},{"playlist":6,"audio":1,"ordem":4},{"playlist":6,"audio":68,"ordem":5},{"playlist":6,"audio":83,"ordem":6},{"playlist":6,"audio":49,"ordem":7},{"playlist":6,"audio":26,"ordem":8},{"playlist":6,"audio":56,"ordem":9},{"playlist":6,"audio":90,"ordem":10},{"playlist":6,"audio":47,"ordem":11},{"playlist":6,"audio":78,"ordem":12},{"playlist":7,"audio":2,"ordem":1},{"playlist":7,"audio":22,"ordem":2},{"playlist":7,"audio":12,"ordem":3},{"playlist":7,"audio":15,"ordem":4},{"playlist":7,"audio":2,"ordem":5},{"playlist":8,"audio":48,"ordem":1},{"playlist":8,"audio":78,"ordem":2},{"playlist":8,"audio":76,"ordem":3},{"playlist":8,"audio":82,"ordem":4},{"playlist":8,"audio":74,"ordem":5},{"playlist":8,"audio":75,"ordem":6},{"playlist":8,"audio":85,"ordem":7},{"playlist":8,"audio":42,"ordem":8},{"playlist":8,"audio":27,"ordem":9},{"playlist":9,"audio":98,"ordem":1},{"playlist":9,"audio":71,"ordem":2},{"playlist":9,"audio":42,"ordem":3},{"playlist":9,"audio":70,"ordem":4},{"playlist":9,"audio":92,"ordem":5},{"playlist":9,"audio":72,"ordem":6},{"playlist":9,"audio":56,"ordem":7},{"playlist":9,"audio":91,"ordem":8},{"playlist":9,"audio":25,"ordem":9},{"playlist":9,"audio":53,"ordem":10},{"playlist":9,"audio":57,"ordem":11},{"playlist":10,"audio":94,"ordem":1},{"playlist":10,"audio":70,"ordem":2},{"playlist":10,"audio":42,"ordem":3},{"playlist":10,"audio":83,"ordem":4},{"playlist":10,"audio":71,"ordem":5},{"playlist":10,"audio":55,"ordem":6},{"playlist":10,"audio":92,"ordem":7},{"playlist":10,"audio":48,"ordem":8},{"playlist":10,"audio":30,"ordem":9},{"playlist":10,"audio":79,"ordem":10},{"playlist":10,"audio":86,"ordem":11},{"playlist":10,"audio":34,"ordem":12},{"playlist":11,"audio":27,"ordem":1},{"playlist":11,"audio":71,"ordem":2},{"playlist":11,"audio":65,"ordem":3},{"playlist":11,"audio":34,"ordem":4},{"playlist":11,"audio":63,"ordem":5},{"playlist":11,"audio":55,"ordem":6},{"playlist":11,"audio":41,"ordem":7},{"playlist":11,"audio":57,"ordem":8},{"playlist":11,"audio":90,"ordem":9},{"playlist":11,"audio":95,"ordem":10},{"playlist":11,"audio":97,"ordem":11},{"playlist":11,"audio":91,"ordem":12},{"playlist":11,"audio":30,"ordem":13},{"playlist":11,"audio":86,"ordem":14},{"playlist":11,"audio":70,"ordem":15},{"playlist":11,"audio":88,"ordem":16},{"playlist":11,"audio":64,"ordem":17},{"playlist":12,"audio":70,"ordem":1},{"playlist":12,"audio":95,"ordem":2},{"playlist":12,"audio":45,"ordem":3},{"playlist":12,"audio":79,"ordem":4},{"playlist":12,"audio":73,"ordem":5},{"playlist":12,"audio":36,"ordem":6},{"playlist":12,"audio":68,"ordem":7},{"playlist":12,"audio":84,"ordem":8},{"playlist":12,"audio":102,"ordem":9},{"playlist":12,"audio":78,"ordem":10},{"playlist":12,"audio":43,"ordem":11},{"playlist":12,"audio":5,"ordem":12},{"playlist":12,"audio":35,"ordem":13},{"playlist":12,"audio":40,"ordem":14},{"playlist":12,"audio":89,"ordem":15},{"playlist":12,"audio":44,"ordem":16},{"playlist":12,"audio":1,"ordem":17},{"playlist":13,"audio":102,"ordem":1},{"playlist":13,"audio":49,"ordem":2},{"playlist":13,"audio":53,"ordem":3},{"playlist":13,"audio":76,"ordem":4},{"playlist":13,"audio":31,"ordem":5},{"playlist":13,"audio":94,"ordem":6},{"playlist":13,"audio":99,"ordem":7},{"playlist":13,"audio":71,"ordem":8},{"playlist":13,"audio":30,"ordem":9},{"playlist":13,"audio":51,"ordem":10},{"playlist":13,"audio":60,"ordem":11},{"playlist":13,"audio":62,"ordem":12},{"playlist":13,"audio":38,"ordem":13},{"playlist":13,"audio":96,"ordem":14},{"playlist":13,"audio":83,"ordem":15},{"playlist":13,"audio":5,"ordem":16},{"playlist":14,"audio":39,"ordem":1},{"playlist":14,"audio":68,"ordem":2},{"playlist":14,"audio":95,"ordem":3},{"playlist":14,"audio":57,"ordem":4},{"playlist":14,"audio":47,"ordem":5},{"playlist":14,"audio":54,"ordem":6},{"playlist":14,"audio":94,"ordem":7},{"playlist":14,"audio":72,"ordem":8},{"playlist":14,"audio":101,"ordem":9},{"playlist":14,"audio":100,"ordem":10},{"playlist":14,"audio":83,"ordem":11},{"playlist":14,"audio":32,"ordem":12},{"playlist":14,"audio":61,"ordem":13},{"playlist":14,"audio":1,"ordem":14},{"playlist":14,"audio":26,"ordem":15},{"playlist":14,"audio":42,"ordem":16},{"playlist":14,"audio":33,"ordem":17},{"playlist":15,"audio":76,"ordem":1},{"playlist":15,"audio":58,"ordem":2},{"playlist":15,"audio":88,"ordem":3},{"playlist":15,"audio":94,"ordem":4},{"playlist":15,"audio":30,"ordem":5},{"playlist":15,"audio":33,"ordem":6},{"playlist":15,"audio":102,"ordem":7},{"playlist":15,"audio":46,"ordem":8},{"playlist":15,"audio":47,"ordem":9},{"playlist":15,"audio":25,"ordem":10},{"playlist":15,"audio":97,"ordem":11},{"playlist":15,"audio":1,"ordem":12},{"playlist":15,"audio":65,"ordem":13},{"playlist":15,"audio":40,"ordem":14},{"playlist":15,"audio":45,"ordem":15},{"playlist":16,"audio":48,"ordem":1},{"playlist":16,"audio":53,"ordem":2},{"playlist":16,"audio":51,"ordem":3},{"playlist":16,"audio":54,"ordem":4},{"playlist":16,"audio":97,"ordem":5},{"playlist":16,"audio":76,"ordem":6},{"playlist":16,"audio":70,"ordem":7},{"playlist":16,"audio":59,"ordem":8},{"playlist":16,"audio":77,"ordem":9},{"playlist":16,"audio":34,"ordem":10},{"playlist":17,"audio":75,"ordem":1},{"playlist":17,"audio":55,"ordem":2},{"playlist":17,"audio":96,"ordem":3},{"playlist":17,"audio":38,"ordem":4},{"playlist":17,"audio":80,"ordem":5},{"playlist":17,"audio":1,"ordem":6},{"playlist":17,"audio":85,"ordem":7},{"playlist":17,"audio":50,"ordem":8},{"playlist":17,"audio":86,"ordem":9},{"playlist":17,"audio":100,"ordem":10},{"playlist":17,"audio":99,"ordem":11},{"playlist":17,"audio":102,"ordem":12},{"playlist":17,"audio":66,"ordem":13},{"playlist":17,"audio":45,"ordem":14},{"playlist":17,"audio":97,"ordem":15},{"playlist":17,"audio":43,"ordem":16},{"playlist":17,"audio":5,"ordem":17}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}

function busqueMusicas() {
	const item = 'musica';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"id":1,"titulo":"Gangsta","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":25,"inicio_voz":21,"inicio_refrao":83,"final_refrao":187,"execucoes":50,"pedidos":30},{"id":2,"titulo":"Los Awesome","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":26,"inicio_voz":13,"inicio_refrao":74,"final_refrao":88,"execucoes":97,"pedidos":18},{"id":3,"titulo":"Collard Greens","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":27,"inicio_voz":20,"inicio_refrao":32,"final_refrao":104,"execucoes":99,"pedidos":81},{"id":4,"titulo":"What They Want","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":28,"inicio_voz":15,"inicio_refrao":15,"final_refrao":39,"execucoes":18,"pedidos":4},{"id":5,"titulo":"Hoover Street","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":29,"inicio_voz":16,"inicio_refrao":161,"final_refrao":229,"execucoes":51,"pedidos":7},{"id":6,"titulo":"Studio","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":30,"inicio_voz":9,"inicio_refrao":53,"final_refrao":101,"execucoes":81,"pedidos":36},{"id":7,"titulo":"Prescription/Oxymoron","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":31,"inicio_voz":7,"inicio_refrao":109,"final_refrao":246,"execucoes":89,"pedidos":22},{"id":8,"titulo":"The Purge","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":32,"inicio_voz":16,"inicio_refrao":124,"final_refrao":150,"execucoes":100,"pedidos":4},{"id":9,"titulo":"Blind Threats","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":33,"inicio_voz":6,"inicio_refrao":117,"final_refrao":228,"execucoes":75,"pedidos":48},{"id":10,"titulo":"Hell Of A Night","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":34,"inicio_voz":16,"inicio_refrao":73,"final_refrao":141,"execucoes":112,"pedidos":22},{"id":11,"titulo":"Break The Bank","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":35,"inicio_voz":22,"inicio_refrao":157,"final_refrao":251,"execucoes":67,"pedidos":8},{"id":12,"titulo":"Man Of The Year","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":36,"inicio_voz":18,"inicio_refrao":96,"final_refrao":177,"execucoes":43,"pedidos":8},{"id":13,"titulo":"His & Her Friend","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":37,"inicio_voz":17,"inicio_refrao":20,"final_refrao":118,"execucoes":61,"pedidos":17},{"id":14,"titulo":"Grooveline Pt 2","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":38,"inicio_voz":10,"inicio_refrao":56,"final_refrao":134,"execucoes":60,"pedidos":33},{"id":15,"titulo":"**** LA","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":39,"inicio_voz":1,"inicio_refrao":74,"final_refrao":137,"execucoes":18,"pedidos":15},{"id":16,"titulo":"Pusha Man","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":40,"inicio_voz":18,"inicio_refrao":29,"final_refrao":89,"execucoes":67,"pedidos":16},{"id":17,"titulo":"Californication","artista":1,"ano":2014,"genero":1,"gravadora":1,"audio":41,"inicio_voz":16,"inicio_refrao":53,"final_refrao":320,"execucoes":17,"pedidos":5},{"id":18,"titulo":"Corre Das Notas","artista":6,"ano":2017,"genero":1,"gravadora":2,"audio":42,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":119,"pedidos":23},{"id":19,"titulo":"Entre o Código da Espada e o Perfume da Rosa","artista":6,"ano":2017,"genero":1,"gravadora":2,"audio":43,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":21,"pedidos":9},{"id":20,"titulo":"Esquimó","artista":6,"ano":2017,"genero":1,"gravadora":2,"audio":44,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":73,"pedidos":14},{"id":21,"titulo":"Fantasma","artista":6,"ano":2017,"genero":1,"gravadora":2,"audio":45,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":57,"pedidos":22},{"id":22,"titulo":"Santa Ceia","artista":6,"ano":2017,"genero":1,"gravadora":2,"audio":46,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":106,"pedidos":15},{"id":23,"titulo":"Verdades Inventadas","artista":6,"ano":2017,"genero":1,"gravadora":2,"audio":47,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":28,"pedidos":9},{"id":24,"titulo":"Geminiano","artista":6,"ano":2017,"genero":1,"gravadora":2,"audio":48,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":3,"pedidos":2},{"id":25,"titulo":"Heresia","artista":6,"ano":2017,"genero":1,"gravadora":2,"audio":49,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":9,"pedidos":7},{"id":26,"titulo":"Irmãos de Arma, Irmãos de Luta","artista":6,"ano":2017,"genero":1,"gravadora":2,"audio":50,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":80,"pedidos":33},{"id":27,"titulo":"O Mundo é Nosso","artista":6,"ano":2017,"genero":1,"gravadora":2,"audio":51,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":101,"pedidos":17},{"id":28,"titulo":"Intro","artista":8,"ano":2017,"genero":1,"gravadora":3,"audio":52,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":15,"pedidos":3},{"id":29,"titulo":"Abre Caminhos","artista":8,"ano":2017,"genero":1,"gravadora":3,"audio":53,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":41,"pedidos":39},{"id":30,"titulo":"Oração à Vitória","artista":8,"ano":2017,"genero":1,"gravadora":3,"audio":54,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":57,"pedidos":4},{"id":31,"titulo":"En Tu Mira (Interlúdio ESÚ)","artista":8,"ano":2017,"genero":1,"gravadora":3,"audio":55,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":76,"pedidos":33},{"id":32,"titulo":"Esú","artista":8,"ano":2017,"genero":1,"gravadora":3,"audio":56,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":83,"pedidos":26},{"id":33,"titulo":"Capitães de Areia","artista":8,"ano":2017,"genero":1,"gravadora":3,"audio":57,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":115,"pedidos":92},{"id":34,"titulo":"Senhor do Bonfim","artista":8,"ano":2017,"genero":1,"gravadora":3,"audio":58,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":5,"pedidos":4},{"id":35,"titulo":"A Pele Que Habito","artista":8,"ano":2017,"genero":1,"gravadora":3,"audio":59,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":120,"pedidos":77},{"id":36,"titulo":"Te Amo Disgraça","artista":8,"ano":2017,"genero":1,"gravadora":3,"audio":60,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":106,"pedidos":96},{"id":37,"titulo":"Imortais e Fatias","artista":8,"ano":2017,"genero":1,"gravadora":3,"audio":61,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":74,"pedidos":43},{"id":38,"titulo":"Mickey","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":62,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":12,"pedidos":3},{"id":39,"titulo":"Guri","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":63,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":70,"pedidos":57},{"id":40,"titulo":"Só Capeta Cuspindo Fogo","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":64,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":45,"pedidos":35},{"id":41,"titulo":"Cobra Criada","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":65,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":54,"pedidos":24},{"id":42,"titulo":"Nossos Filhos","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":66,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":108,"pedidos":5},{"id":43,"titulo":"Vitória Poluída","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":67,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":100,"pedidos":51},{"id":44,"titulo":"Do Contra Ao Favor","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":68,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":79,"pedidos":22},{"id":45,"titulo":"Perda","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":69,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":32,"pedidos":28},{"id":46,"titulo":"Nazi Tolices","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":70,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":11,"pedidos":4},{"id":47,"titulo":"Heróis Da Nação Falida","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":71,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":87,"pedidos":25},{"id":48,"titulo":"Curupira","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":72,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":49,"pedidos":18},{"id":49,"titulo":"Pressão Total","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":73,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":59,"pedidos":36},{"id":50,"titulo":"Praia da Bosta","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":74,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":38,"pedidos":31},{"id":51,"titulo":"Maçã","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":75,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":101,"pedidos":95},{"id":52,"titulo":"Pasqualin Na Terra Do Xupa-Kabra","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":76,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":83,"pedidos":68},{"id":53,"titulo":"Homem Borracha","artista":10,"ano":1999,"genero":7,"gravadora":4,"audio":77,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":112,"pedidos":5},{"id":54,"titulo":"Wesley\'s Theory","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":78,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":2,"pedidos":0},{"id":55,"titulo":"For Free (Interlude)","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":79,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":90,"pedidos":35},{"id":56,"titulo":"King Kunta","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":80,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":52,"pedidos":21},{"id":57,"titulo":"Institutionalized","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":81,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":28,"pedidos":4},{"id":58,"titulo":"These Walls","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":82,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":37,"pedidos":33},{"id":59,"titulo":"U","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":83,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":33,"pedidos":28},{"id":60,"titulo":"Alright","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":84,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":63,"pedidos":48},{"id":61,"titulo":"For Sale? (Interlude)","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":85,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":65,"pedidos":34},{"id":62,"titulo":"Momma","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":86,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":80,"pedidos":75},{"id":63,"titulo":"Hood Politics","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":87,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":2,"pedidos":1},{"id":64,"titulo":"How Much a Dollar Cost","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":88,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":20,"pedidos":4},{"id":65,"titulo":"Complexion (A Zulu Love)","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":89,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":109,"pedidos":43},{"id":66,"titulo":"The Blacker the Berry","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":90,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":47,"pedidos":30},{"id":67,"titulo":"You Ain\'t Gotta Lie (Momma Said)","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":91,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":89,"pedidos":27},{"id":68,"titulo":"I","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":92,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":95,"pedidos":50},{"id":69,"titulo":"Mortal Man","artista":2,"ano":2015,"genero":1,"gravadora":1,"audio":93,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":16,"pedidos":10},{"id":70,"titulo":"Vinum Sabbathi","artista":15,"ano":2000,"genero":7,"gravadora":5,"audio":94,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":15,"pedidos":5},{"id":71,"titulo":"Funeralopolis","artista":15,"ano":2000,"genero":7,"gravadora":5,"audio":95,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":43,"pedidos":35},{"id":72,"titulo":"Weird Tales: I. Electric Frost - II. Golgotha - III. Altar of Melektaus","artista":15,"ano":2000,"genero":7,"gravadora":5,"audio":96,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":17,"pedidos":0},{"id":73,"titulo":"Barbarian","artista":15,"ano":2000,"genero":7,"gravadora":5,"audio":97,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":11,"pedidos":8},{"id":74,"titulo":"I, the Witchfinder","artista":15,"ano":2000,"genero":7,"gravadora":5,"audio":98,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":9,"pedidos":0},{"id":75,"titulo":"The Hills Have Eyes","artista":15,"ano":2000,"genero":7,"gravadora":5,"audio":99,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":50,"pedidos":14},{"id":76,"titulo":"We Hate You","artista":15,"ano":2000,"genero":7,"gravadora":5,"audio":100,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":40,"pedidos":8},{"id":77,"titulo":"Dopethrone","artista":15,"ano":2000,"genero":7,"gravadora":5,"audio":101,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":68,"pedidos":59},{"id":78,"titulo":"Mind Transferral","artista":15,"ano":2000,"genero":7,"gravadora":5,"audio":102,"inicio_voz":"","inicio_refrao":"","final_refrao":"","execucoes":50,"pedidos":45}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}

function busqueAudios() {
	const item = 'audio';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"id":1,"localizacao":"../audios/vinhetas/onde-a-coruja-dorme.mp3","duracao":12},{"id":2,"localizacao":"../audios/vinhetas/cafe-da-manha-dos-campeoes.mp3","duracao":19},{"id":3,"localizacao":"../audios/vinhetas/músicas-para-boi-dormir.mp3","duracao":20},{"id":4,"localizacao":"../audios/vinhetas/projeto-inumanos.mp3","duracao":12},{"id":5,"localizacao":"../audios/vinhetas/voz-da-argentina.mp3","duracao":26},{"id":6,"localizacao":"../audios/efeitos-sonoros/gargalhadas.mp3","duracao":6},{"id":7,"localizacao":"../audios/efeitos-sonoros/vaias.mp3","duracao":5},{"id":8,"localizacao":"../audios/efeitos-sonoros/trombetas.mp3","duracao":9},{"id":9,"localizacao":"../audios/efeitos-sonoros/bomba.mp3","duracao":3},{"id":10,"localizacao":"../audios/efeitos-sonoros/aplausos.mp3","duracao":8},{"id":11,"localizacao":"../audios/comerciais/loja-do-perigo","duracao":28},{"id":12,"localizacao":"../audios/comerciais/trato-desfeito","duracao":68},{"id":13,"localizacao":"../audios/comerciais/churros-do-primo-do-seu-madruga","duracao":9},{"id":14,"localizacao":"../audios/comerciais/caídos-do-caminhao","duracao":51},{"id":15,"localizacao":"../audios/comerciais/refrescos-do-chaves","duracao":49},{"id":16,"localizacao":"../audios/comerciais/fashion-reptiliano","duracao":19},{"id":17,"localizacao":"../audios/comerciais/lado-claro-da-lua","duracao":18},{"id":18,"localizacao":"../audios/comerciais/forjaria-sob-agua","duracao":55},{"id":19,"localizacao":"../audios/comerciais/restaurante-bola-quadrada","duracao":43},{"id":20,"localizacao":"../audios/comerciais/rigbys","duracao":23},{"id":21,"localizacao":"../audios/programas/onde-a-coruja-dorme.mp3","duracao":4800},{"id":22,"localizacao":"../audios/programas/cafe-da-manha-dos-campeoes.mp3","duracao":2400},{"id":23,"localizacao":"../audios/programas/projeto-inumanos.mp3","duracao":5400},{"id":24,"localizacao":"../audios/programas/voz-da-argentina.mp3","duracao":7210},{"id":25,"localizacao":"../audios/musicas/SchoolBoy Q/01 Gangsta.mp3","duracao":231},{"id":26,"localizacao":"../audios/musicas/SchoolBoy Q/02 Los Awesome.mp3","duracao":252},{"id":27,"localizacao":"../audios/musicas/SchoolBoy Q/03 Collard Greens.mp3","duracao":299},{"id":28,"localizacao":"../audios/musicas/SchoolBoy Q/04 What They Want.mp3","duracao":267},{"id":29,"localizacao":"../audios/musicas/SchoolBoy Q/05 Hoover Street.mp3","duracao":396},{"id":30,"localizacao":"../audios/musicas/SchoolBoy Q/06 Studio.mp3","duracao":278},{"id":31,"localizacao":"../audios/musicas/SchoolBoy Q/07 Prescription-Oxymoron.mp3","duracao":429},{"id":32,"localizacao":"../audios/musicas/SchoolBoy Q/08 The Purge.mp3","duracao":294},{"id":33,"localizacao":"../audios/musicas/SchoolBoy Q/09 Blind Threats.mp3","duracao":269},{"id":34,"localizacao":"../audios/musicas/SchoolBoy Q/10 Hell Of A Night.mp3","duracao":272},{"id":35,"localizacao":"../audios/musicas/SchoolBoy Q/11 Break The Bank.mp3","duracao":354},{"id":36,"localizacao":"../audios/musicas/SchoolBoy Q/12 Man Of The Year.mp3","duracao":216},{"id":37,"localizacao":"../audios/musicas/SchoolBoy Q/13 His & Her Friend.mp3","duracao":175},{"id":38,"localizacao":"../audios/musicas/SchoolBoy Q/14 Grooveline Pt 2.mp3","duracao":258},{"id":39,"localizacao":"../audios/musicas/SchoolBoy Q/15 ---- LA.mp3","duracao":200},{"id":40,"localizacao":"../audios/musicas/SchoolBoy Q/16 Pusha Man.mp3","duracao":103},{"id":41,"localizacao":"../audios/musicas/SchoolBoy Q/17 Californication.mp3","duracao":377},{"id":42,"localizacao":"../audios/musicas/Djonga/01 Corre Das Notas.mp3","duracao":218},{"id":43,"localizacao":"../audios/musicas/Djonga/02 Entre o Código da Espada e o P.mp3","duracao":128},{"id":44,"localizacao":"../audios/musicas/Djonga/03 Esquimó.mp3","duracao":256},{"id":45,"localizacao":"../audios/musicas/Djonga/04 Fantasma.mp3","duracao":236},{"id":46,"localizacao":"../audios/musicas/Djonga/05 Santa Ceia.mp3","duracao":279},{"id":47,"localizacao":"../audios/musicas/Djonga/06 Verdades Inventadas.mp3","duracao":178},{"id":48,"localizacao":"../audios/musicas/Djonga/07 Geminiano.mp3","duracao":180},{"id":49,"localizacao":"../audios/musicas/Djonga/08 Heresia.mp3","duracao":170},{"id":50,"localizacao":"../audios/musicas/Djonga/09 Irmãos de Arma (FBC Interlúdio.mp3","duracao":139},{"id":51,"localizacao":"../audios/musicas/Djonga/10 O Mundo é Nosso.mp3","duracao":223},{"id":52,"localizacao":"../audios/musicas/Baco Exu do Blues/01 Intro.mp3","duracao":133},{"id":53,"localizacao":"../audios/musicas/Baco Exu do Blues/02 Abre Caminhos.mp3","duracao":141},{"id":54,"localizacao":"../audios/musicas/Baco Exu do Blues/03 Oração à Vitória.mp3","duracao":236},{"id":55,"localizacao":"../audios/musicas/Baco Exu do Blues/04 En Tu Mira (Interlúdio ESÚ).mp3","duracao":110},{"id":56,"localizacao":"../audios/musicas/Baco Exu do Blues/05 Esú.mp3","duracao":248},{"id":57,"localizacao":"../audios/musicas/Baco Exu do Blues/06 Capitães de Areia.mp3","duracao":190},{"id":58,"localizacao":"../audios/musicas/Baco Exu do Blues/07 Senhor do Bonfim.mp3","duracao":175},{"id":59,"localizacao":"../audios/musicas/Baco Exu do Blues/08 A Pele Que Habito.mp3","duracao":307},{"id":60,"localizacao":"../audios/musicas/Baco Exu do Blues/09 Te Amo Disgraça.mp3","duracao":290},{"id":61,"localizacao":"../audios/musicas/Baco Exu do Blues/10 Imortais e Fatias.mp3","duracao":275},{"id":62,"localizacao":"../audios/musicas/Mukeka di Rato/01 Mickey.mp3","duracao":93},{"id":63,"localizacao":"../audios/musicas/Mukeka di Rato/02 Guri.mp3","duracao":62},{"id":64,"localizacao":"../audios/musicas/Mukeka di Rato/03 Só Capeta Cuspindo Fogo.mp3","duracao":62},{"id":65,"localizacao":"../audios/musicas/Mukeka di Rato/04 Cobra Criada.mp3","duracao":61},{"id":66,"localizacao":"../audios/musicas/Mukeka di Rato/05 Nossos Filhos.mp3","duracao":102},{"id":67,"localizacao":"../audios/musicas/Mukeka di Rato/06 Vitória Poluída.mp3","duracao":79},{"id":68,"localizacao":"../audios/musicas/Mukeka di Rato/07 Do Contra Ao Favor.mp3","duracao":110},{"id":69,"localizacao":"../audios/musicas/Mukeka di Rato/08 Perda.mp3","duracao":54},{"id":70,"localizacao":"../audios/musicas/Mukeka di Rato/09 Nazi Tolices.mp3","duracao":84},{"id":71,"localizacao":"../audios/musicas/Mukeka di Rato/10 Heróis Da Nação Falida.mp3","duracao":77},{"id":72,"localizacao":"../audios/musicas/Mukeka di Rato/11 Curupira.mp3","duracao":105},{"id":73,"localizacao":"../audios/musicas/Mukeka di Rato/12 Pressão Total.mp3","duracao":74},{"id":74,"localizacao":"../audios/musicas/Mukeka di Rato/13 Praia da Bosta.mp3","duracao":85},{"id":75,"localizacao":"../audios/musicas/Mukeka di Rato/14 Maçã.mp3","duracao":53},{"id":76,"localizacao":"../audios/musicas/Mukeka di Rato/15 Pasqualin Na Terra Do Xupa-Kab.mp3","duracao":89},{"id":77,"localizacao":"../audios/musicas/Mukeka di Rato/16 Homem Borracha.mp3","duracao":114},{"id":78,"localizacao":"../audios/musicas/Kendrick Lamar/01 01. Wesley\'s Theory.mp3","duracao":287},{"id":79,"localizacao":"../audios/musicas/Kendrick Lamar/02 02. For Free (Interlude).mp3","duracao":130},{"id":80,"localizacao":"../audios/musicas/Kendrick Lamar/03 03. King Kunta.mp3","duracao":234},{"id":81,"localizacao":"../audios/musicas/Kendrick Lamar/04 04. Institutionalized.mp3","duracao":271},{"id":82,"localizacao":"../audios/musicas/Kendrick Lamar/05 05. These Walls.mp3","duracao":301},{"id":83,"localizacao":"../audios/musicas/Kendrick Lamar/06 06. U.mp3","duracao":268},{"id":84,"localizacao":"../audios/musicas/Kendrick Lamar/07 07. Alright.mp3","duracao":219},{"id":85,"localizacao":"../audios/musicas/Kendrick Lamar/08 08. For Sale¿ (Interlude).mp3","duracao":291},{"id":86,"localizacao":"../audios/musicas/Kendrick Lamar/09 09. Momma.mp3","duracao":283},{"id":87,"localizacao":"../audios/musicas/Kendrick Lamar/10 10. Hood Politics.mp3","duracao":292},{"id":88,"localizacao":"../audios/musicas/Kendrick Lamar/11 11. How Much a Dollar Cost.mp3","duracao":261},{"id":89,"localizacao":"../audios/musicas/Kendrick Lamar/12 12. Complexion (A Zulu Love).mp3","duracao":263},{"id":90,"localizacao":"../audios/musicas/Kendrick Lamar/13 13. The Blacker the Berry.mp3","duracao":328},{"id":91,"localizacao":"../audios/musicas/Kendrick Lamar/14 14. You Ain\'t Gotta Lie (Momma Said).mp3","duracao":241},{"id":92,"localizacao":"../audios/musicas/Kendrick Lamar/15 15. i.mp3","duracao":336},{"id":93,"localizacao":"../audios/musicas/Kendrick Lamar/16 16. Mortal Man.mp3","duracao":727},{"id":94,"localizacao":"../audios/musicas/Electric Wizard/01 - Vinum Sabbathi.mp3","duracao":185},{"id":95,"localizacao":"../audios/musicas/Electric Wizard/02 - Funeralopolis.mp3","duracao":523},{"id":96,"localizacao":"../audios/musicas/Electric Wizard/03 - Weird Tales I. Electric Frost - II. Golgotha - III. Altar of Melektaus.mp3","duracao":904},{"id":97,"localizacao":"../audios/musicas/Electric Wizard/04 - Barbarian.mp3","duracao":389},{"id":98,"localizacao":"../audios/musicas/Electric Wizard/05 - I, the Witchfinder.mp3","duracao":664},{"id":99,"localizacao":"../audios/musicas/Electric Wizard/06 - The Hills Have Eyes.mp3","duracao":46},{"id":100,"localizacao":"../audios/musicas/Electric Wizard/07 - We Hate You.mp3","duracao":308},{"id":101,"localizacao":"../audios/musicas/Electric Wizard/08 - Dopethrone.mp3","duracao":636},{"id":102,"localizacao":"../audios/musicas/Electric Wizard/09 - Mind Transferral.mp3","duracao":896}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}

function busqueSubgeneros() {
	const item = 'subgenero';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"musica":1,"genero":2},{"musica":1,"genero":3},{"musica":1,"genero":4},{"musica":2,"genero":3},{"musica":5,"genero":2},{"musica":5,"genero":3},{"musica":10,"genero":3},{"musica":18,"genero":5},{"musica":19,"genero":5},{"musica":20,"genero":5},{"musica":21,"genero":5},{"musica":22,"genero":5},{"musica":23,"genero":5},{"musica":24,"genero":5},{"musica":25,"genero":5},{"musica":26,"genero":5},{"musica":27,"genero":5},{"musica":28,"genero":5},{"musica":29,"genero":5},{"musica":30,"genero":5},{"musica":30,"genero":6},{"musica":31,"genero":5},{"musica":32,"genero":5},{"musica":32,"genero":6},{"musica":33,"genero":5},{"musica":34,"genero":5},{"musica":35,"genero":5},{"musica":36,"genero":5},{"musica":36,"genero":6},{"musica":37,"genero":5},{"musica":38,"genero":8},{"musica":38,"genero":9},{"musica":39,"genero":8},{"musica":39,"genero":9},{"musica":40,"genero":8},{"musica":40,"genero":9},{"musica":41,"genero":8},{"musica":41,"genero":9},{"musica":42,"genero":8},{"musica":42,"genero":9},{"musica":43,"genero":8},{"musica":43,"genero":9},{"musica":44,"genero":8},{"musica":44,"genero":9},{"musica":45,"genero":8},{"musica":45,"genero":9},{"musica":46,"genero":8},{"musica":46,"genero":9},{"musica":47,"genero":8},{"musica":47,"genero":9},{"musica":48,"genero":8},{"musica":48,"genero":9},{"musica":49,"genero":8},{"musica":49,"genero":9},{"musica":50,"genero":8},{"musica":50,"genero":9},{"musica":51,"genero":8},{"musica":51,"genero":9},{"musica":52,"genero":8},{"musica":52,"genero":9},{"musica":53,"genero":8},{"musica":53,"genero":9},{"musica":56,"genero":10},{"musica":59,"genero":10},{"musica":60,"genero":10},{"musica":62,"genero":10},{"musica":63,"genero":10},{"musica":66,"genero":10},{"musica":70,"genero":11},{"musica":70,"genero":12},{"musica":70,"genero":13},{"musica":71,"genero":11},{"musica":71,"genero":12},{"musica":71,"genero":13},{"musica":72,"genero":11},{"musica":72,"genero":12},{"musica":72,"genero":13},{"musica":73,"genero":11},{"musica":73,"genero":12},{"musica":73,"genero":13},{"musica":74,"genero":11},{"musica":74,"genero":12},{"musica":74,"genero":13},{"musica":75,"genero":11},{"musica":75,"genero":12},{"musica":75,"genero":13},{"musica":76,"genero":11},{"musica":76,"genero":12},{"musica":76,"genero":13},{"musica":77,"genero":11},{"musica":77,"genero":12},{"musica":77,"genero":13},{"musica":78,"genero":11},{"musica":78,"genero":12},{"musica":78,"genero":13}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}

function busqueGeneros() {
	const item = 'genero';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"id":1,"nome":"Rap"},{"id":2,"nome":"Gangsta Rap"},{"id":3,"nome":"Hip Hop"},{"id":4,"nome":"Internacional"},{"id":5,"nome":"Nacional"},{"id":6,"nome":"MPB"},{"id":7,"nome":"Rock"},{"id":8,"nome":"Hardcore"},{"id":9,"nome":"Punk"},{"id":10,"nome":"Jazz"},{"id":11,"nome":"Doom metal"},{"id":12,"nome":"Stoner rock"},{"id":13,"nome":"Sludge metal"}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}

function busqueGravadoras() {
	const item = 'gravadora';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"id":1,"nome":"Top Dawg Entertainment"},{"id":2,"nome":"CEIA Ent."},{"id":3,"nome":"999"},{"id":4,"nome":"Läjä Records"},{"id":5,"nome":"Rise Above"}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}

function busqueVinhetas() {
	const item = 'vinheta';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"id":1,"titulo":"Onde a Coruja Dorme","audio":1},{"id":2,"titulo":"Café da Manhã dos Campeões","audio":2},{"id":3,"titulo":"Músicas para Boi Dormir","audio":3},{"id":4,"titulo":"Projeto Inumanos","audio":4},{"id":5,"titulo":"Voz da Argentina","audio":5}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}

function busqueEfeitosSonoros() {
	const item = 'efeitoSonoro';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"id":1,"titulo":"Gargalhadas","audio":6},{"id":2,"titulo":"Vaias","audio":7},{"id":3,"titulo":"Trombetas","audio":8},{"id":4,"titulo":"Bomba","audio":9},{"id":5,"titulo":"Aplausos","audio":10}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}

function busqueComerciais() {
	const item = 'comercial';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"id":1,"titulo":"Loja do Perigo","audio":11},{"id":2,"titulo":"Trato Desfeito","audio":12},{"id":3,"titulo":"Churros do Primo do Seu Madruga","audio":13},{"id":4,"titulo":"Caídos do Caminhão","audio":14},{"id":5,"titulo":"Refrescos do Chaves","audio":15},{"id":6,"titulo":"Fashion Reptiliano","audio":16},{"id":7,"titulo":"Lado Claro da Lua","audio":17},{"id":8,"titulo":"Forjaria Sob Água","audio":18},{"id":9,"titulo":"Restaurante Bola Quadrada","audio":19},{"id":10,"titulo":"Rigby\'s","audio":20}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}

function busqueProgramas() {
	const item = 'programa';
	if (window.localStorage.getItem(item) === null) {
		window.localStorage.setItem(item, '[{"id":1,"titulo":"Onde a Coruja Dorme","audio":21},{"id":2,"titulo":"Café da Manhã dos Campeões","audio":22},{"id":3,"titulo":"Projeto Inumanos","audio":23},{"id":4,"titulo":"Voz da Argentina","audio":24}]');
	}
	return JSON.parse(window.localStorage.getItem(item));
}
