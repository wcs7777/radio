'use strict';

function inicioPlaylistsCriar() {
	window.onbeforeunload = function (event) {
		if (mudeDuracaoTotal(0) > 0) {
			return 'Deseja sair?';
		} else {
			return;
		}
	}
	const data = document.getElementById('data');
	mostrePlaceholderDatetimeLocal(data);
	data.addEventListener('blur', valideData);
	document.getElementById('salvar').addEventListener('click', () => {
		if (playlistValida()) {
			salvePlaylist();
		}
	});
	for (const e of document.getElementsByClassName('entrada-erro')) {
		document.getElementById(e.getAttribute('for')).addEventListener(
			'blur', () => e.classList.remove('invisivel')
		);
	}
	const wrapperEsconder = document.getElementById('wrapper-esconder');
	document.getElementById('programa').addEventListener('click', () =>
		crieDivAudios(
			wrapperEsconder,
			busqueProgramas(),
			'Programas',
			'Nome do programa',
			'programa'
		)
	);
	document.getElementById('comercial').addEventListener('click', () =>
		crieDivAudios(
			wrapperEsconder,
			busqueComerciais(),
			'Comerciais',
			'Nome do comercial',
			'comercial'
		)
	);
	document.getElementById('vinheta').addEventListener('click', () =>
		crieDivAudios(
			wrapperEsconder,
			busqueVinhetas(),
			'Vinhetas',
			'Nome da vinheta',
			'vinheta'
		)
	);
	document.getElementById('efeito-sonoro').addEventListener('click', () =>
		crieDivAudios(
			wrapperEsconder,
			busqueEfeitosSonoros(),
			'Efeitos Sonoros',
			'Nome do efeito sonoro',
			'efeito-sonoro'
		)
	);
	document.getElementById('musica').addEventListener('click', () =>
		crieDivOpcaoAudio(wrapperEsconder, crieDivMusicasTabelaFiltros())
	);
}

function inicioPlaylistEditar() {
	inicioPlaylistsCriar();
	const playlist = busqueEntidade(busquePlaylists(), idPlaylist);
	const sequencias = busqueSequenciasPlaylist(idPlaylist);
	document.getElementById('nome').value = playlist.nome;
	const data = document.getElementById('data');
	data.value = formateDateTime(
		playlist.programada_para
	);
	if (!valideData()) {
		data.focus();
		data.blur();
	}
	for (const s of sequencias) {
		const tipo = tipoAudio(s.audio);
		const audio = tipo.audio;
		audio.tipo = tipo.nome;
		audio.segundos = duracaoAudio(audio.audio);
		audio.duracao = formateSegundos(audio.segundos);
		adicioneAudio(audio);
	}
}

function valideData() {
	const data = document.getElementById('data');
	const erroData = document.getElementById('erro-data');
	const dtl = paraDatalocalTime(data.value);
	let valida = (dtl !== '');
	if (!valida) {
		erroData.innerText = 'Por favor, informe quando a playlist irá ao ar!';
	} else {
		valida = (data.min <= dtl && dtl <= data.max);
		if (!valida) {
			const min = paraData(data.min);
			const max = paraData(data.max);
			erroData.innerText = `A data deve estar entre ${min} e ${max}!`;
		}
	}
	data.setCustomValidity((valida)? '' : 'inválida');
	return valida;
}

function playlistValida() {
	const nome = document.getElementById('nome');
	let valida = true;
	if (!valideData()) {
		document.getElementById('data').focus();
		valida = false;
	}
	if (!nome.validity.valid) {
		nome.focus();
		valida = false;
	}
	if (mudeDuracaoTotal(0) <= 0) {
		valida = false;
		const fechar = crieFecharModal();
		crieModalWrapper(
			crieModal(
				[
					fechar,
					crieTextNode('Por favor, informe os áudios da sua playlist!')
				],
				'modal-mensagem'
			),
			[fechar]
		);
	}
	return valida;
}

function salvePlaylist() {
	const inputNome = document.getElementById('nome');
	const inputData = document.getElementById('data');
	const programada_para = paraDatalocalTime(
		inputData.value
	).replace('T', ' ').slice(0, 16);
	const playlist = {
		id: idPlaylist || proximoId('playlist'),
		nome: inputNome.value,
		programada_para: programada_para
	};
	const tabela = document.getElementById('tabela-principal');
	const tbody = tabela.querySelector('tbody');
	const sequencias = [];
	let row = undefined;
	for (let i = 0; row = tbody.rows[i]; i++) {
		sequencias.push({
			playlist: playlist.id,
			ordem: i + 1,
			audio: row.audio.audio
		});
	}
	if (idPlaylist) {
		deleteEntidade('playlist', busquePlaylists(), idPlaylist);
		deleteSequenciasPlaylist(idPlaylist);
	}
	salve('playlist', busquePlaylists(), playlist);
	salve('sequencia', busqueSequencias(), sequencias);
	mudeDuracaoTotal(-1 * mudeDuracaoTotal(0));
	const voltar = crieAnchor(
		'playlists/mostrar.html', 
		'Voltar',
		'botao botao-cancelar'
	);
	const criar = crieAnchor(
		'playlists/criar.html', 
		'Criar',
		'botao botao-confirmar'
	);
	crieModalWrapper(
		crieModal(
			[
				crieTextNode('A playlist foi salva com sucesso!'),
				crie('div', [voltar, criar], 'botoes-confirmacao')
			],
			'modal-mensagem'
		),
		[voltar, criar]
	);
}

function tabelaAudios() {
	if (!tabelaAudios.tabela) {
		tabelaAudios.classesTabela = 'tabela tabela-filtros';
		tabelaAudios.tabela = crie(
			'table',
			[
				crie(
					'thead',
						crie(
							'tr',
							[
								crie('th', 'Título', '', 'audio-titulo'),
								crie('th', 'Duração', '', 'audio-duracao'),
								crie('th', 'Pôr', 'opcoes'),
							]
						)
				),
				crie('tbody')
			],
			tabelaAudios.classesTabela,
			'tabela-filtros'
		);
	}
	return tabelaAudios.tabela;
}

function crieDivOpcaoAudio(
	anterior,
	novo,
	classListOpcoesAudio='',
	classListTabelaPrincipal=''
) {
	const opcoesAudio = document.getElementById('opcoes-audio');
	const tabelaPrincipal = document.getElementById('tabela-principal');
	adicioneClasses(opcoesAudio, classListOpcoesAudio);
	adicioneClasses(tabelaPrincipal, classListTabelaPrincipal);
	esconda(anterior);
	opcoesAudio.appendChild(novo);
	novo.querySelector('.icone-voltar').addEventListener('click', () => {
		novo.remove();
		removaClasses(opcoesAudio, classListOpcoesAudio);
		removaClasses(tabelaPrincipal, classListTabelaPrincipal);
		desesconda(anterior);
	});
}

function adicioneClasses(element, classes='') {
	if (classes) {
		if (!Array.isArray(classes)) {
			element.classList.add(classes);
		} else {
			for (const classe of classes) {
				element.classList.add(classe);
			}
		}
	}
	return element;
}

function removaClasses(element, classes='') {
	if (classes) {
		if (!Array.isArray(classes)) {
			element.classList.remove(classes);
		} else {
			for (const classe of classes) {
				element.classList.remove(classe);
			}
		}
	}
	return element;
}

function recrieTabelaAudios(audios) {
	for (const a of audios) {
		a.segundos = duracaoAudio(a.audio);
		a.duracao = formateSegundos(a.segundos);
	}
	adicioneEventOrdenacoes(
		tabelaAudios(),
		[
			{
				th: tabelaAudios().querySelector('#audio-titulo'),
				propriedade: 'titulo'
			},
			{
				th: tabelaAudios().querySelector('#audio-duracao'),
				propriedade: 'duracao'
			}
		],
		audios,
		crieRowsAudios
	);
	return recrieTBody(tabelaAudios(), crieRowsAudios(audios));
}

function mudeDuracaoTotal(segundos) {
	mudeDuracaoTotal.atual = mudeDuracaoTotal.atual + segundos || segundos;
	if (mudeDuracaoTotal.atual < 0) {
		mudeDuracaoTotal.atual = 0;
	}
	document.getElementById(
		'duracao-total'
	).innerText = formateSegundos(mudeDuracaoTotal.atual);
	return mudeDuracaoTotal.atual;
}

function crieRowsAudios(audios) {
	return audios.map(a =>
		crie(
			'tr',
			[
				crie('td', a.titulo),
				crie('td', a.duracao),
				crie(
					'td',
					crieIcone(
						'mais',
						crieButton(() => adicioneAudio(a))
					),
					'opcoes'
				)
			]
		)
	);
}

function adicioneAudio(audio) {
	mudeDuracaoTotal(audio.segundos);
	const tr = crie('tr', '', audio.tipo);
	tr.audio = audio;
	tr.appendChild(
		crieFragment([
			crie('td', audio.titulo),
			crie('td', audio.duracao),
			crie(
				'td',
				[
					crieIcone(
						'informacao',
						crieButton(() =>
							crieModalAudio({ nome: audio.tipo, audio: audio })
						)
					),
					crieIcone(
						'cima',
						crieButton(() => {
							if (tr.previousElementSibling) {
								tr.parentNode.insertBefore(
									tr,
									tr.previousElementSibling
								);
							}
						})
					),
					crieIcone(
						'baixo',
						crieButton(() => {
							if (tr.nextElementSibling) {
								tr.parentNode.insertBefore(
									tr.nextElementSibling,
									tr
								);
							}
						})
					),
					crieIcone(
						'menos',
						crieButton(() => {
							mudeDuracaoTotal(-1 * audio.segundos);
							tr.remove();
						})
					),
				],
				'opcoes'
			)
		])
	);
	document
		.getElementById('tabela-principal')
		.querySelector('tbody')
		.appendChild(tr);
}

function crieDivAudios(anterior, audios, titulo, placeholder, classList='') {
	tabelaAudios().setAttribute(
		'class',
		`${tabelaAudios.classesTabela}${classList? ' ' + classList : ''}`
	);
	for (const audio of audios) {
		audio.tipo = classList;
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
					audios,
					'titulo',
					recrieTabelaAudios,
					'pesquisa-filtro'
				),
				crie(
					'div', recrieTabelaAudios(audios), 'tabela-scroll tabela-filtros'
				)
			],
			classList
		),
		'aumento-largura',
		'diminuicao-fonte'
	)
}
