'use strict';

function inicioPlaylistsMostrar() {
	recrieTabelaPlaylists(busquePlaylists());
	const pesquisa = document.getElementById('pesquisa');
	pesquisa.addEventListener('keydown', (event) => {
		const temQuery = (pesquisa.value !== '');
		if (event.key === 'Enter' && temQuery) {
			event.preventDefault();
			recrieTabelaPlaylists(
				ordemAscendente(busquePlaylists(), 'nome')
					.filter(p =>
						p.nome.toLocaleLowerCase().includes(
							pesquisa.value.toLocaleLowerCase()
						)
					)
			);
			pesquisa.filtrou = true;
		} else if (!temQuery && pesquisa.filtrou) {
			pesquisa.filtrou = false;
			recrieTabelaPlaylists(busquePlaylists());
		}
	});
}

function recrieTabelaPlaylists(playlists) {
	for (const p of playlists) {
		p.duracao = formateSegundos(tempoTotalPlaylist(p.id));
		p.data = formateDateTime(p.programada_para);
	}
	const table = document.getElementById('tabela-playlists');
	adicioneEventOrdenacoes(
		table,
		[
			{
				th: document.getElementById('playlist-nome'),
				propriedade: 'nome'
			},
			{
				th: document.getElementById('playlist-data'),
				propriedade: 'programada_para'
			},
			{
				th: document.getElementById('playlist-duracao'),
				propriedade: 'duracao'
			}
		],
		playlists,
		crieRowsPlaylists
	);
	recrieTBody(table, crieRowsPlaylists(playlists));
}

function crieRowsPlaylists(playlists) {
	return playlists.map(p =>
		crie(
			'tr',
			[
				crie('td', p.nome),
				crie('td', p.data),
				crie('td', p.duracao),
				crie(
					'td',
					[
						crieIcone(
							'informacao',
							crieButton(() => crieModalPlaylistInformacoes(p))
						),
						crieIcone(
							'editar',
							crieAnchor(
								`${document.baseURI}/playlists/editar.html?id=${p.id}`
							)
						),
						crieIcone(
							'excluir',
							crieButton(() => crieModalExcluirPlaylist(p))
						)
					],
					'opcoes'
				)
			]
		)
	);
}

function crieModalPlaylistInformacoes(playlist) {
	const fechar = crieFecharModal();
	crieModalWrapper(
		crieModal([
			fechar,
				crieInformacoes(
					[
						{ termo: 'Nome', definicao: playlist.nome },
						{ termo: 'Data', definicao: playlist.data },
						{ termo: 'Duração', definicao: playlist.duracao }
					],
					'playlist-informacoes'
				),
			crie(
				'div',
				crieTabelaSequencias(
					ordemAscendente(
						sequenciasPlaylist(playlist.id),
						'ordem'
					)
				),
				'tabela-scroll'
			)
		]),
		[fechar]
	);
}

function crieInformacoes(informacoes, classList='') {
	return crie(
		'ul',
		informacoes.map(i => crieInformacao(i.termo, i.definicao)),
		classList
	);
}

function crieInformacao(termo, definicao) {
	return crie(
		'li', [crie('span', `${termo}: `, 'termo'), crieTextNode(definicao)]
	);
}

function crieTabelaSequencias(sequencias) {
	for (const s of sequencias) {
		s.tipo = tipoAudio(s.audio);
		s.duracao = formateSegundos(duracaoAudio(s.audio));
		s.titulo = s.tipo.audio.titulo;
		s.tipo.audio.duracao = s.duracao;
	}
	const thOrdem = crie('th', 'Ordem');
	const thTitulo = crie('th', 'Título');
	const thDuracao = crie('th', 'Duração');
	const tabela = crie(
		'table',
		[
			crie(
				'thead',
				crie(
					'tr',
					[
						thOrdem,
						thTitulo,
						thDuracao,
						crie('th', 'Informações', 'opcoes')
					]
				)
			),
			crie('tbody')
		],
		'tabela tabela-sequencias'
	);
	adicioneEventOrdenacoes(
		tabela,
		[
			{ th: thOrdem, propriedade: 'ordem' },
			{ th: thTitulo, propriedade: 'titulo' },
			{ th: thDuracao, propriedade: 'duracao'}
		],
		sequencias,
		crieRowsSequencias
	);
	return recrieTBody(tabela, crieRowsSequencias(sequencias));
}

function crieRowsSequencias(sequencias) {
	return sequencias.map(s =>
		crie(
			'tr',
			[
				crie('td', s.ordem),
				crie('td', s.titulo),
				crie('td', s.duracao),
				crie(
					'td',
					crieIcone('informacao', crieButton(() => crieModalAudio(s.tipo))),
					'opcoes'
				)
			],
			s.tipo.nome
		)
	);
}

function crieModalAudio(tipo) {
	const fechar = crieFecharModal();
	if (tipo.nome === 'musica') {
		return crieModalMusica(informacoesMusica(tipo.audio));
	} else {
		return crieModalWrapper(
			crieModal(
				[fechar, crieInformacoesTipoAudio(tipo)], 
				'modal-audio'
			),
			[fechar]
		);
	}
}

function crieInformacoesTipoAudio(tipo) {
	return crieInformacoes(
		[
			{ termo: termoTipoAudio(tipo.nome), definicao: tipo.audio.titulo },
			{ termo: 'Duração', definicao: tipo.audio.duracao }
		],
		tipo.nome
	);
}

function crieModalExcluirPlaylist(playlist) {
	return crieModalConfirmacao(
		crie('button', 'Manter'),
		crieButton(
			() => {
				deleteEntidade('playlist', busquePlaylists(), playlist.id),
				recrieTabelaPlaylists(busquePlaylists());
			},
			'Excluir'
		),
		crieFragment([
			crieInformacoes(
				[
					{ termo: 'Nome', definicao: playlist.nome },
					{ termo: 'Data', definicao: playlist.data },
					{ termo: 'Duração', definicao: playlist.duracao }
				],
				'playlist-informacoes'
			),
			crie(
				'div',
				crieTabelaSequencias(
					ordemAscendente(
						sequenciasPlaylist(playlist.id),
						'ordem'
					)
				),
				'tabela-scroll'
			)
		]),
		'modal-excluir-playlist'
	);
}

function nomeGenero(idGenero) {
	nomeGenero.id2Nome = (
		nomeGenero.id2Nome ||
		new Map(busqueGeneros().map(g => [g.id, g.nome]))
	);
	let nome = nomeGenero.id2Nome.get(idGenero);
	if (!nome) {
		const genero = busqueGeneros().find(g => g.id === idGenero);
		if (genero) {
			nome = genero.nome;
			nomeGenero.id2Nome.set(idGenero, nome);
		}
	}
	return nome;
}

function nomeArtista(idArtista) {
	nomeArtista.id2Nome = (
		nomeArtista.id2Nome ||
		new Map(busqueArtistas().map(a => [a.id, a.nome]))
	);
	let nome = nomeArtista.id2Nome.get(idArtista);
	if (!nome) {
		const artista = busqueArtistas().find(a => a.id === idArtista);
		if (artista) {
			nome = artista.nome;
			nomeArtista.id2Nome.set(idArtista, nome);
		}
	}
	return nome;
}
