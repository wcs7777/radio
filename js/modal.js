function crieModalPlaylistInformacoes(playlist) {
	const fechar = crieIcone('x', crie('button', '', '', 'fechar'));
	const informacoes = crie(
		'ul',
		[
			crie(
				'li',
				[crie('span', 'Nome: ', 'negrito'), crieTextNode(playlist.nome)]
			),
			crie(
				'li',
				[
					crie('span', 'Data: ', 'negrito'),
					crieTextNode(formateDateTime(playlist.programada_para))
				]
			),
			crie(
				'li',
				[
					crie('span', 'Duração: ', 'negrito'),
					crieTextNode(playlist.duracao)
				]
			)
		],
		'vertical-info'
	);
	let sequencias = ordemAscendente(
		busqueSequencias().filter(s => s.playlist === playlist.id),
		'ordem'
	);
	for (const sequencia of sequencias) {
		sequencia.tipo = tipoAudio(sequencia.audio);
		sequencia.duracao = formateSegundos(duracaoAudio(sequencia.audio));
		sequencia.titulo = sequencia.tipo.audio.titulo;
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
		'tabela'
	);
	adicioneEventOrdenacoes(
		[
			[thOrdem, 'ordem'],
			[thTitulo, 'titulo'],
			[thDuracao, 'duracao']
		],
		tabela,
		sequencias,
		crieRowsSequencias,
		1
	);
	recrieTBody(tabela, crieRowsSequencias(sequencias));
	document.querySelector('.conteudo').appendChild(
		crieModalWrapper(
			crieModal([fechar, informacoes, crie('div', tabela, 'tabela-scroll')]),
			[fechar]
		)
	);
}

function crieModal(children, classList='', id='') {
	return crie('div', children, 'modal ' + classList, id);
}

function crieModalWrapper(modal, botoesFechar=[]) {
	const modalWrapper = crie('div', modal, 'modal-wrapper');
	modalWrapper.addEventListener('click', (event) => {
		if (event.target === modalWrapper) {
			modalWrapper.remove();
		}
	});
	for (const fechar of botoesFechar) {
		fechar.addEventListener('click', () => modalWrapper.remove());
	}
	return modalWrapper;
}
