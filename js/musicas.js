'use strict';

function inicioMusicasMostrar() {
	recrieTabelaMusicas(busqueMusicas());
	pesquisa.addEventListener('keydown', (event) => {
		const temQuery = (pesquisa.value !== '');
		if (event.key === 'Enter' && temQuery) {
			event.preventDefault();
			recrieTabelaMusicas(
				ordemAscendente(musicasFiltradas(), 'titulo')
					.filter(m =>
						m.titulo.toLocaleLowerCase().includes(
							pesquisa.value.toLocaleLowerCase()
						)
					)
			);
			pesquisa.filtrou = true;
		} else if (!temQuery && pesquisa.filtrou) {
			pesquisa.filtrou = false;
			recrieTabelaMusicas(musicasFiltradas());
		}
	});
	document.getElementById('opcao-filtrar').addEventListener('click', () =>
		recrieTabelaMusicas(musicasFiltradas())
	);
	document.getElementById('opcao-filtros').addEventListener('click', () =>
		crieDivOpcaoAudio(
			document.getElementById('wrapper-esconder'),
		crieDivMusicasFiltros()
	)
	);
	document.getElementById('opcao-limpar').addEventListener('click', () => {
		limpeFiltros();
		recrieTabelaMusicas(busqueMusicas());
	});
	const fm = document.getElementById('formulario-musica');
	fm.querySelector('#descartar').addEventListener('click', () => esconda(fm));
	fm.querySelector("#salvar").addEventListener('click', () => {
		console.log('salvar');
	});
	abraOutraInformacao(fm, 'opcao-participante');
	abraOutraInformacao(fm, 'opcao-compositor');
	abraOutraInformacao(fm, 'opcao-subgenero');
	abraOutraInformacao(fm, 'opcao-tempos');
}

function musicaEditadaValida() {
	const titulo = document.getElementById('titulo');
	const artista = document.getElementById('artista');
	const genero = document.getElementById('genero');
	const gravador = document.getElementById('gravadora');
	const ano = document.getElementById('ano');

	let valida = true;
}

function abraOutraInformacao(formularioMusica, id) {
	const opcao = document.getElementById(id);
	const nome = id.slice(5);
	const outra = document.getElementById('formulario' + nome);
	const input = document.getElementById(nome.slice(1));
	if (input) {
		const table = document.getElementById('tabela' + nome);
		const tbody = table.querySelector('tbody');
		if (!table.array) {
			table.array = [];
		}
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && input.validity.valid) {
				e.preventDefault();
				input.value = input.value.trim();
				const lc = input.value.toLocaleLowerCase();
				if (!table.array.includes(i => i.toLocaleLowerCase() === lc)) {
					adicioneRows(table, table.array.concat(input.value));
				}
				input.value = '';
			} else {
				input.focus();
			}
		});
	}
	document.getElementById('voltar' + nome).addEventListener('click', () => {
		desesconda(formularioMusica);
		esconda(outra);
	});
	opcao.addEventListener('click', () => {
		desesconda(outra);
		esconda(formularioMusica);
	});
	return formularioMusica;
}

function recrieTabelaMusicas(musicas) {
	for (const m of musicas) {
		const infos = informacoesMusica(m);
		m.nomeArtista = infos.artista;
		m.nomeGenero = infos.genero;
		m.duracao = infos.duracao;
		m.infos = infos;
	}
	const tabela = document.getElementById('tabela-principal');
	adicioneEventOrdenacoes(
		tabela,
		[
			{
				th: tabela.querySelector('#musica-artista'),
				propriedade: 'nomeArtista'
			},
			{
				th: tabela.querySelector('#musica-titulo'),
				propriedade: 'titulo'
			},
			{
				th: tabela.querySelector('#musica-genero'),
				propriedade: 'nomeGenero'
			},
			{
				th: tabela.querySelector('#musica-duracao'),
				propriedade: 'duracao'
			}
		],
		musicas,
		crieRowsMusicas
	);
	return recrieTBody(tabela, crieRowsMusicas(musicas));
}

function crieRowsMusicas(musicas) {
	return musicas.map(m =>
		crie(
			'tr',
			[
				crie('td', m.nomeArtista),
				crie('td', m.titulo),
				crie('td', m.nomeGenero),
				crie('td', m.duracao),
				crie(
					'td',
					[
						crieIcone(
							'informacao',
							crieButton(() => crieModalMusica(m.infos))
						),
						crieIcone(
							'editar',
							crieButton(() => abraEdicaoMusica(m))
						),
						crieIcone(
							'excluir',
							crieButton(() => {
								crieModalExcluirMusica(m);
							})
						)
					],
					'opcoes'
				)
			]
		)
	);
}

function adicioneCells(valor) {
	return crieFragment([
		crie('td', valor),
		crie(
			'td',
			crieIcone(
				'excluir',
				crieButton(() => tr.remove())),
				'opcoes'
		)
	]);
}

function adicioneRow(valor) {
	const tr = crie('tr');
	tr.appendChild(adicioneCells(valor));
	return tr;
}

function adicioneRows(tabela, array) {
	tabela.array = array;
	let tbody = tabela.querySelector('tbody');
	tbody.remove();
	tbody = crie('tbody');
	for (const i of array) {
		tbody.appendChild(adicioneRow(i));
	}
	tabela.appendChild(tbody);
	return tabela;
}

function abraEdicaoMusica(m) {
	const f = document.getElementById('formulario-musica');
	f.querySelector('#titulo').value = m.titulo;
	f.querySelector('#artista').value = m.nomeArtista;
	f.querySelector('#genero').value = m.nomeGenero;
	f.querySelector('#gravadora').value = m.infos.gravadora;
	f.querySelector('#ano').value = m.ano;
	adicioneRows(
		document.getElementById('tabela-participante'),
		m.infos.participacoesArray
	);
	adicioneRows(
		document.getElementById('tabela-compositor'),
		m.infos.compositoresArray
	);
	adicioneRows(
		document.getElementById('tabela-subgenero'),
		m.infos.subgenerosArray
	);
	/* tempos */
	desesconda(f);
}

function crieModalExcluirMusica(musica) {
	const playlists = playlistsAudio(musica.audio);
	const referenciada = (playlists.length > 0);
	const excluir = () => {
		if (referenciada) {
			for (const p of playlists) {
				deleteAudioPlaylist(musica.audio, p.id);
			}
		}
		deleteEntidade('musica', busqueMusicas(), musica.id);
	};
	let mensagem = 'Deseja excluir essa música?';
	if (referenciada) {
		mensagem = [
			crieTextNode(
				'Ao excluir está música ela será retirada das seguintes playlists: '
			),
			crie(
				'ul',
				playlists.map(p => crie('li', p.nome))
			)
		];
	}
	return crieModalConfirmacao(
		crie('button', 'Manter'),
		crieButton(excluir, 'Excluir'),
		crieFragment([
			crieInformacoes(
				[
					{ termo: 'Música', definicao: musica.titulo },
					{ termo: 'Artista', definicao: musica.infos.artista }
				],
				'musica'
			),
			crie('div', mensagem, 'confirmacao')
		]),
		'modal-excluir-musica'
	);
}

function informacoesMusica(musica) {
	const participacoes = [];
	const compositores = [];
	const subgeneros = [];
	const gravadoraObj = busqueEntidade(busqueGravadoras(), musica.gravadora);
	for (const p of artistasMusica(musica).slice(1)) {
		participacoes.push(busque('nome', busqueArtistas(), p));
	}
	for (const c of compositoresMusica(musica.id)) {
		compositores.push(busque('nome', busqueArtistas(), c));
	}
	for (const s of generosMusica(musica).slice(1)) {
		subgeneros.push(busque('nome', busqueGeneros(), s));
	}
	return {
		musica: musica.titulo,
		artista: busque('nome', busqueArtistas(), musica.artista),
		participacoes: participacoes.join(', '),
		participacoesArray: participacoes,
		compositores: compositores.join(', '),
		compositoresArray: compositores,
		genero: busque('nome', busqueGeneros(), musica.genero),
		subgeneros: subgeneros.join(', '),
		subgenerosArray: subgeneros,
		gravadoraObj: gravadoraObj,
		gravadora: gravadoraObj.nome,
		duracao: formateSegundos(duracaoAudio(musica.audio)),
		ano: musica.ano,
		inicio_voz: formateSegundos(musica.inicio_voz),
		inicio_refrao: formateSegundos(musica.inicio_refrao),
		final_refrao: formateSegundos(musica.final_refrao),
		execucoes: musica.execucoes,
		pedidos: musica.pedidos
	};
}

function varios(campo) {
	return campo.includes(',');
}

function informacoesMusicaTermoDefinicao(infos) {
	const t = [
		{ termo: 'Música', definicao: infos.musica },
		{ termo: 'Artista', definicao: infos.artista },
	];
	if (infos.participacoes !== '') {
		t.push({
			termo: (varios(infos.participacoes))? 'Partipações' : 'Participação',
			definicao: infos.participacoes
		});
	}
	if (infos.compositores !== '') {
		t.push({
			termo: (varios(infos.compositores))? 'Compositores' : 'Compositor',
			definicao: infos.compositores
		});
	}
	t.push({ termo: 'Gênero', definicao: infos.genero });
	if (infos.subgeneros !== '') {
		t.push({
			termo: (varios(infos.subgeneros))? 'Subgêneros': 'Subgênero',
			definicao: infos.subgeneros
		});
	}
	t.push({ termo: 'Gravadora', definicao: infos.gravadora });
	t.push({ termo: 'Duração', definicao: infos.duracao });
	t.push({ termo: 'Ano', definicao: infos.ano });
	t.push({ termo: 'Início da voz', definicao: infos.inicio_voz });
	t.push({ termo: 'Início do refrão', definicao: infos.inicio_refrao });
	t.push({ termo: 'Final do refrão', definicao: infos.final_refrao });
	t.push({ termo: 'Vezes tocada', definicao: infos.execucoes });
	t.push({ termo: 'Vezes pedida', definicao: infos.pedidos });
	return t;
}

function crieModalMusica(informacoes) {
	const fechar = crieFecharModal();
	return crieModalWrapper(
		crieModal(
			[fechar, crieInformacoesMusica(informacoes)],
			'modal-audio'
		),
		[fechar]
	);
}

function crieInformacoesMusica(informacoes) {
	return crieInformacoes(
		informacoesMusicaTermoDefinicao(informacoes),
		'musica'
	);
}

function limpeFiltros() {
	filtros(true);
	atualizeFiltrosEscolhidos();
}

function crieDivMusicasTabelaFiltros() {
	const div = crie('div', '', 'musica');
	div.appendChild(
		crieFragment([
			crieIcone('voltar', crie('button')),
			crie('h2', 'Músicas', 'tipo-filtro'),
			crie(
				'ul',
				[
					crieOpcaoFiltroMusica(
						'Mostrar',
						() => crieDivMusicas(div, musicasFiltradas())
					),
					crieOpcaoFiltroMusica(
						'Filtrar',
						() => crieDivOpcaoAudio(div, crieDivMusicasFiltros())
					),
					crieOpcaoFiltroMusica('Limpar Filtros', limpeFiltros)
				],
				'filtro'
			)
		])
	);
	return div;
}

function crieFiltroNumero(id, placeholder, nome, tipo) {
	const filtro = crie('input', '', 'entrada', id);
	filtro.setAttribute('type', 'text');
	filtro.setAttribute('min', '1');
	filtro.setAttribute('placeholder', placeholder);
	filtro.addEventListener('keydown', (event) => {
		const key = event.key;
		const enter = (key === 'Enter');
		if (enter && filtro.value !== '') {
			event.preventDefault();
			if (filtro.value != 0) {
				adicioneFiltro({
					nome: `${filtro.value} ${nome}`,
					tipo: tipo,
					valor: filtro.value
				});
			} else {
				filtro.value = '';
			}
		} else if (!enter && key !== 'Backspace' && (isNaN(key) || key === ' ')) {
			event.preventDefault();
		}
	});
	mostrePlaceholder(filtro, 'number');
	const label = crie('label', placeholder, 'label-entrada');
	label.setAttribute('for', id);
	return crie(
		'div',
		crie('div', [filtro, label], 'grupo-entrada '),
		'filtro-numero'
	);
}

function crieDivMusicasFiltros() {
	const div = crie('div', '', 'musica');
	div.appendChild(
		crieFragment([
			crieIcone('voltar', crie('button')),
			crie('h2', 'Músicas - Filtrar', 'tipo-filtro'),
			crie(
				'ul',
				[
					crieFiltroNumero(
						'mais-tocadas',
						'Mais tocadas',
						'mais tocadas',
						'execucoes'
					),
					crieFiltroNumero(
						'mais-pedidas',
						'Mais pedidas',
						'mais pedidas',
						'pedidos'
					),
					crieOpcaoFiltroMusica(
						'Artistas',
						() => {
							crieDivFiltros(
								div,
								busqueArtistasPorIds(busqueArtistasMusicas()),
								'artista',
								'Artistas',
								'Nome do artista'
							);
						}
					),
					crieOpcaoFiltroMusica(
						'Compositores',
						() => {
							crieDivFiltros(
								div,
								busqueArtistasPorIds(busqueCompositores()),
								'compositor',
								'Compositores',
								'Nome do compositor'
							);
						}
					),
					crieOpcaoFiltroMusica(
						'Gêneros',
						() => {
							crieDivFiltros(
								div,
								busqueGeneros(),
								'genero',
								'Gêneros',
								'Gênero'
							);
						}
					),
					crieOpcaoFiltroMusica(
						'Gravadoras',
						() => {
							crieDivFiltros(
								div,
								busqueGravadoras(),
								'gravadora',
								'Nome da gravadora',
								'Gravadoras'
							);
						}
					)
				],
				'filtro'
			)
		])
	);
	return div;
}

function crieDivArtistas() {
	return crie(
		'div',
		[
			crieIcone('voltar', crie('button')),
			crie('h2', 'Artistas', 'tipo-filtro')
		],
		'musica'
	);
}

function crieDivCompositores() {
	return crie(
		'div',
		[
			crieIcone('voltar', crie('button')),
			crie('h2', 'Compositores', 'tipo-filtro')
		],
		'musica'
	);
}

function crieDivGeneros() {
	return crie(
		'div',
		[
			crieIcone('voltar', crie('button')),
			crie('h2', 'Gêneros', 'tipo-filtro')
		],
		'musica'
	);
}

function crieDivGravadoras() {
	return crie(
		'div',
		[
			crieIcone('voltar', crie('button')),
			crie('h2', 'Gravadoras', 'tipo-filtro')
		],
		'musica'
	);
}

function recrieTabelaFiltros(filtros) {
	adicioneEventOrdenacao(
		tabelaFiltros(),
		tabelaFiltros().querySelector('th'),
		'nome',
		filtros,
		crieRowsFiltros
	);
	return recrieTBody(tabelaFiltros(), crieRowsFiltros(filtros));
}

function crieRowsFiltros(filtros) {
	return filtros.map(f =>
		crie(
			'tr',
			[
				crie('td', f.nome),
				crie(
					'td',
					crieIcone('filtro', crieButton(() => adicioneFiltro(f))),
					'opcoes'
				)
			]
		)
	);
}

function adicioneFiltro(filtro) {
	const tipo = filtro.tipo;
	if (Array.isArray(filtros()[tipo])) {
		if (!filtros()[tipo].includes(filtro)) {
			filtros()[tipo].push(filtro);
		}
	} else {
		filtros()[tipo] = filtro;
	}
	atualizeFiltrosEscolhidos(filtros());
}

function removaFiltro(filtro) {
	const i = filtro.tipo;
	if (Array.isArray(filtros()[i])) {
		filtros()[i].splice(filtros()[i].indexOf(filtro), 1);
	} else {
		filtros()[i] = 0;
	}
}

function atualizeFiltrosEscolhidos() {
	const div = document.getElementById('etiquetas');
	div.firstElementChild.remove();
	const lis = document.createDocumentFragment();
	for (const i of Object.keys(filtros())) {
		if (Array.isArray(filtros()[i])) {
			if (filtros()[i].length > 0) {
				lis.appendChild(
					crieFragment(
						crieFiltrosEscolhidos(filtros()[i])
					)
				);
			}
		} else if (filtros()[i].valor > 0) {
			lis.appendChild(crieFiltroEscolhido(filtros()[i]));
		}
	}
	div.appendChild(crie('ul', lis));
}

function crieFiltrosEscolhidos(array) {
	return array.map(i => crieFiltroEscolhido(i));
}

function crieFiltroEscolhido(filtro) {
	const li = crie('li', '', 'etiqueta');
	li.appendChild(
		crieFragment([
			crie('span', filtro.nome),
			crieIcone(
				'x',
				crieButton(() => {
					li.remove();
					removaFiltro(filtro);
				})
			)
		])
	);
	return li;
}

function tabelaFiltros() {
	if (!tabelaFiltros.tabela) {
		tabelaFiltros.tabela = crie(
			'table',
			[
				crie(
					'thead',
					crie('tr',
						[
							crie('th', 'Nome', 'filtro-nome'),
							crie('th', 'Filtrar', 'opcoes')
						]
					)
				),
				crie('tbody')
			],
			'tabela musica'
		)
	}
	return tabelaFiltros.tabela;
}

function crieDivFiltros(anterior, filtros, tipo, titulo, placeholder) {
	for (const filtro of filtros) {
		filtro.tipo = tipo;
	}
	crieDivOpcaoAudio(
		anterior,
		crie(
			'div',
			[
				crieIcone('voltar', crie('button')),
				crie('h2', titulo, 'tipo-filtro'),
				crieCaixaPesquisa(
					placeholder,
					filtros,
					'nome',
					recrieTabelaFiltros,
					'pesquisa-filtro'
				),
				crie(
					'div', recrieTabelaFiltros(filtros), 'tabela-scroll tabela-filtros'
				)
			],
			'musica'
		),
		'aumento-largura',
		'diminuicao-fonte'
	);
}

function crieDivMusicas(anterior, musicas) {
	for (const m of musicas) {
		m.tipo = 'musica';
		const infos = informacoesMusica(m);
		m.nomeArtista = infos.artista;
		m.nomeGenero = infos.genero;
		m.duracao = infos.duracao;
		m.segundos = duracaoAudio(m.audio);
		m.infos = infos;
	}
	crieDivOpcaoAudio(
		anterior,
		crie(
			'div',
			[
				crieIcone('voltar', crie('button')),
				crie('h2', 'Tabela das Músicas', 'tipo-filtro'),
				crieCaixaPesquisa(
					'Título da música',
					musicas,
					'titulo',
					recrieTabelaMusicasCP,
					'pesquisa-filtro'
				),
				crie(
					'div',
					recrieTabelaMusicasCP(musicas),
					'tabela-scroll tabela-filtros'
				)
			],
			'diminuicao-fonte musica'
		),
		'aumento-largura',
		['diminuicao-fonte', 'playlist']
	);
}

function crieOpcaoFiltroMusica(label, listener) {
	return crie('li', crieButton(listener, label), 'filtro musica');
}

function tabelaMusicasCP() {
	if (!tabelaMusicasCP.tabela) {
		tabelaMusicasCP.tabela = crie(
			'table',
			[
				crie(
					'thead',
					crie('tr',
						[
							crie('th', 'Título', '', 'musica-titulo'),
							crie('th', 'Artista', '', 'musica-artista'),
							crie('th', 'Gênero', '', 'musica-genero'),
							crie('th', 'Duração', '', 'musica-duracao'),
							crie('th', 'Opções', 'opcoes')
						]
					)
				),
				crie('tbody')
			],
			'tabela musica'
		)
	}
	return tabelaMusicasCP.tabela;
}

function recrieTabelaMusicasCP(musicas) {
	adicioneEventOrdenacoes(
		tabelaMusicasCP(),
		[
			{
				th: tabelaMusicasCP().querySelector('#musica-titulo'),
				propriedade: 'titulo',
			},
			{
				th: tabelaMusicasCP().querySelector('#musica-artista'),
				propriedade: 'nomeArtista',
			},
			{
				th: tabelaMusicasCP().querySelector('#musica-genero'),
				propriedade: 'nomeGenero'
			},
			{
				th: tabelaMusicasCP().querySelector('#musica-duracao'),
				propriedade: 'duracao'
			}
		],
		musicas,
		crieRowsMusicasCP
	);
	return recrieTBody(tabelaMusicasCP(), crieRowsMusicasCP(musicas));
}

function crieRowsMusicasCP(musicas) {
	return musicas.map(m =>
		crie(
			'tr',
			[
				crie('td', m.titulo),
				crie('td', m.nomeArtista),
				crie('td', m.nomeGenero),
				crie('td', m.duracao),
				crie(
					'td',
					[
						crieIcone(
							'informacao',
							crieButton(() => crieModalMusica(m.infos))
						),
						crieIcone(
							'mais',
							crieButton(() => adicioneAudio(m))
						)
					],
					'opcoes',
				)
			]
		)
	);
}

function filtros(limpe=false) {
	if (limpe) {
		filtros.obj = false;
	}
	if (!filtros.obj) {
		filtros.obj = {
			execucoes: { valor: 0 },
			pedidos: { valor: 0 },
			artista: [],
			compositor: [],
			genero: [],
			gravadora: []
		};
	}
	return filtros.obj;
}

function musicasFiltradas() {
	return filtrePorArtistas(
		filtrePorCompositores(
			filtrePorGeneros(
				filtrePorGravadoras(
					filtrePorPedidos(
						filtrePorExecucoes(
							busqueMusicas(),
							filtros().execucoes.valor
						),
						filtros().pedidos.valor
					),
					filtros().gravadora.map(g => g.id)
				),
				filtros().genero.map(g => g.id)
			),
			filtros().compositor.map(c => c.id)
		),
		filtros().artista.map(a => a.id)
	);
}

function filtrePorExecucoes(musicas, execucoes) {
	if (execucoes > 0) {
		return ordemAscendente(musicas, 'execucoes').slice(-1 * execucoes);
	} else {
		return musicas;
	}
}

function filtrePorPedidos(musicas, pedidos) {
	if (pedidos) {
		return ordemAscendente(musicas, 'pedidos').slice(-1 * pedidos);
	} else {
		return musicas;
	}
}

function filtrePorArtistas(musicas, artistas) {
	if (artistas.length > 0) {
		return musicas.filter(m =>
			artistasMusica(m).some(a => artistas.includes(a))
		);
	} else {
		return musicas;
	}
}

function filtrePorCompositores(musicas, compositores) {
	if (compositores.length > 0) {
		return musicas.filter(m =>
			compositoresMusica(m.id).some(c => compositores.includes(c))
		);
	} else {
		return musicas;
	}
}

function filtrePorGeneros(musicas, generos) {
	if (generos.length > 0) {
		return musicas.filter(m =>
			generosMusica(m).some(g => generos.includes(g))
		);
	} else {
		return musicas;
	}
}

function filtrePorGravadoras(musicas, gravadoras) {
	if (gravadoras.length > 0) {
		return musicas.filter(m =>
			gravadoras.includes(m.gravadora)
		);
	} else {
		return musicas;
	}
}
