'use strict';

function crie(element, children='', classList='', id='') {
	const e = document.createElement(element);
	if (children) {
		e.appendChild(
			(typeof children !== 'object')? crieTextNode(children) :
			(!Array.isArray(children))? children : crieFragment(children)
		);
	}
	if (classList) {
		e.classList = classList;
	}
	if (id) {
		e.id = id;
	}
	return e;
}

function crieTextNode(data) {
	return document.createTextNode(data);
}

function crieFragment(children) {
	const fragment = document.createDocumentFragment();
	for (const child of children) {
		fragment.appendChild(child);
	}
	return fragment;
}

function crieGrupoEntrada(
	id,
	type,
	required='',
	placeholder,
	erro='',
	min='',
	max='',
	pattern=''
	) {
	const entrada = crie('input', '', 'entrada', id);
	entrada.setAttribute('type', 'text');
	if (required !== '') {
		entrada.setAttribute('required', 'required');
	}
	entrada.setAttribute('placeholder', placeholder);
	const label = crie('label', placeholder, 'label-entrada');
	label.setAttribute('for', id);
	const labelErro = (erro !== '')? crie('label', erro, 'entrada-erro') : '';
	if (labelErro !== '') {
		labelErro.setAttribute('for', id);
	}
	if (type !== 'text') {
		mostrePlaceholder(input, type);
	}
	if (min !== '') {
		entrada.setAttribute('type', min);
	}
	if (max !== '') {
		entrada.setAttribute('type', max);
	}
	if (pattern !== '') {
		entrada.setAttribute('type', pattern);
	}
	if (labelErro !== '') {
		return crie('div', [entrada, label, labelErro], 'grupo-entrada');
	} else {
		return crie('div', [entrada, label], 'grupo-entrada');
	}
}

function crieCaixaPesquisa(
	placeholder,
	array,
	propriedade,
	recrieTabela,
	classList='',
	id='pesquisa'
) {
	const caixa = crie('input', '', 'entrada', id);
	caixa.setAttribute('type', 'text');
	caixa.setAttribute('placeholder', placeholder);
	ativeCaixaPesquisa(caixa, array, propriedade, recrieTabela);
	const label = crie('label', placeholder, 'label-entrada');
	label.setAttribute('for', id);
	return crie(
		'div',
		crie('div', [caixa, label], 'grupo-entrada'),
		'pesquisa-wrapper ' + classList
	);
}

function crieCaixaPesquisa2(
	placeholder,
	array,
	propriedade,
	recrieTabela,
	classList='',
	id='pesquisa'
) {
	const caixa = crie('input', '', 'entrada', id);
	caixa.setAttribute('type', 'text');
	caixa.setAttribute('placeholder', placeholder);
	ativeCaixaPesquisa(caixa, array, propriedade, recrieTabela);
	const label = crie('label', placeholder, 'label-entrada');
	label.setAttribute('for', id);
	return crie(
		'div',
		crie('div', [caixa, label], 'grupo-entrada'),
		'pesquisa-wrapper ' + classList
	);
}

function ativeCaixaPesquisa(caixa, array, propriedade, recrieTabela) {
	caixa.addEventListener('keydown', (event) => {
		const temPesquisa = (caixa.value !== '');
		if (event.key === 'Enter' && temPesquisa) {
			event.preventDefault();
			recrieTabela(
				ordemAscendente(array, propriedade).filter(i =>
					i[propriedade].toLocaleLowerCase().includes(
						caixa.value.toLocaleLowerCase()
					)
				)
			);
			pesquisa.filtrou = true;
		}
		else if (!temPesquisa && caixa.filtrou) {
			pesquisa.filtrou = false;
			recrieTabela(array);
		}
	});
	return caixa;
}

function crieButton(listener, children='', classList='', id='') {
	const button = crie('button', children, classList, id);
	button.addEventListener('click', listener);
	return button;
}

function crieAnchor(href, children='', classList='', id='') {
	const a = crie('a', children, classList, id);
	a.href = href;
	return a;
}

function crieTable(thead, tbody, tfoot=[], classList='', id='') {
	return crie('table', [thead, tbody, tfoot], classList, id);
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
	document.querySelector('.conteudo').appendChild(modalWrapper);
	return modalWrapper;
}

function crieModalConfirmacao(cancelar, confirmar, child, classList='') {
	const fechar = crieFecharModal();
	cancelar.classList.add('botao');
	cancelar.classList.add('botao-cancelar');
	confirmar.classList.add('botao');
	confirmar.classList.add('botao-confirmar');
	return crieModalWrapper(
		crieModal(
			[
				fechar,
				child,
				crie('div', [cancelar, confirmar], 'botoes-confirmacao')
			],
			classList
		),
		[fechar, cancelar, confirmar]
	);
}

function crieFecharModal() {
	return crieIcone('x', crie('button', '', 'fechar'));
}

function esconda(element) {
	element.classList.add('escondido');
}

function desesconda(element) {
	element.classList.remove('escondido');
}

function mostrePlaceholder(input, type) {
	const volteTipoPara = () => {
		input.setAttribute('type', type);
		input.focus();
	};
	input.addEventListener('focus', volteTipoPara);
	input.addEventListener('hover', volteTipoPara);
	input.addEventListener('blur', () => input.setAttribute('type', 'text'));
}

function mostrePlaceholderDatetimeLocal(input) {
	input.setAttribute('min', agora());
	input.setAttribute('max', proximoAno());
	if (navigator.userAgent.includes('Firefox')) {
		return;
	}
	const volteTipoPara = () => {
		const dtl = paraDatalocalTime(input.value);
		input.setAttribute('type', 'datetime-local');
		input.value = dtl;
		input.focus();
	};
	input.addEventListener('focus', volteTipoPara);
	input.addEventListener('hover', volteTipoPara);
	input.addEventListener('blur', () => {
		const data = paraData(input.value);
		input.setAttribute('type', 'text');
		input.value = data;
	});
}

function agora() {
	if (!agora.data) {
		const date = new Date();
		const ano = date.getFullYear();
		const mes = complementeZero(date.getMonth() + 1);
		const dia = complementeZero(date.getDate());
		const hora = complementeZero(date.getHours());
		const minutos = complementeZero(date.getMinutes());
		agora.data = `${ano}-${mes}-${dia}T${hora}:${minutos}:00`;
	}
	return agora.data;
}

function proximoAno() {
	if (!proximoAno.data) {
		const date = new Date();
		const ano = date.getFullYear() + 1;
		const mes = complementeZero(date.getMonth() + 1);
		const dia = complementeZero(date.getDate());
		const hora = complementeZero(date.getHours());
		const minutos = complementeZero(date.getMinutes());
		proximoAno.data = `${ano}-${mes}-${dia}T${hora}:${minutos}:00`;
	}
	return proximoAno.data;
}

function crieIcone(icone, element) {
	element.classList.add('icone');
	element.classList.add(`icone-${icone}`);
	element.appendChild(
		crieIconeSvg(
			(icone === 'informacao')? svgInfo() :
			(icone === 'editar')? svgEditar() :
			(icone === 'excluir')? svgExcluir() :
			(icone === 'x')? svgX() :
			(icone === 'voltar')? svgVoltar() :
			(icone === 'cima')? svgCima() :
			(icone === 'baixo')? svgBaixo() :
			(icone === 'menos')? svgMenos() :
			(icone === 'mais')? svgMais() :
			(icone === 'filtro')? svgFiltro() :
			(icone === 'play')? svgPlay() :
			(icone === 'pause')? svgPause() : ''
		)
	);
	return element;
}

function crieIconeSvg(svg) {
	const div = crie('div');
	div.innerHTML = svg;
	return div.firstChild;
}

function svgPlay() {
	return (
`<svg class="icone-play" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	<path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
</svg>`);
}

function svgPause() {
	return (
`<svg class="icone-pause" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	<path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
</svg>`);
}

function svgInfo() {
	return (
`<svg class="icone-informacao" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
	<path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
	<circle cx="8" cy="4.5" r="1"/>
</svg>`);
}

function svgEditar() {
	return (
`<svg class="icone-editar" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	<path d="M15.213 1.018a.572.572 0 0 1 .756.05.57.57 0 0 1 .057.746C15.085 3.082 12.044 7.107 9.6 9.55c-.71.71-1.42 1.243-1.952 1.596-.508.339-1.167.234-1.599-.197-.416-.416-.53-1.047-.212-1.543.346-.542.887-1.273 1.642-1.977 2.521-2.35 6.476-5.44 7.734-6.411z"/>
	<path d="M7 12a2 2 0 0 1-2 2c-1 0-2 0-3.5-.5s.5-1 1-1.5 1.395-2 2.5-2a2 2 0 0 1 2 2z"/>
</svg>`);
}

function svgExcluir() {
	return (
`<svg class="icone-excluir" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	<path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
</svg>`);
}

function svgX() {
	return (
`<svg class="icone-x" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	<path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
	<path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
</svg>`);
}

function svgVoltar() {
	return (
`<svg class="icone-voltar" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	<path fill-rule="evenodd" d="M5.854 4.646a.5.5 0 0 1 0 .708L3.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z"/>
	<path fill-rule="evenodd" d="M2.5 8a.5.5 0 0 1 .5-.5h10.5a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
</svg>`);
}

function svgCima() {
	return (
`<svg class="icone-cima" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	<path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
	<path fill-rule="evenodd" d="M7.646 2.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8 3.707 5.354 6.354a.5.5 0 1 1-.708-.708l3-3z"/>
</svg>`);
}

function svgBaixo() {
	return (
`<svg class="icone-baixo" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	<path fill-rule="evenodd" d="M4.646 9.646a.5.5 0 0 1 .708 0L8 12.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z"/>
	<path fill-rule="evenodd" d="M8 2.5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-1 0V3a.5.5 0 0 1 .5-.5z"/>
</svg>`);
}

function svgMenos() {
	return (
`<svg class="icone-menos" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	<path fill-rule="evenodd" d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/>
</svg>`);
}

function svgMais() {
	return (
`<svg class="icone-mais" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	<path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
	<path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
</svg>`);
}

function svgFiltro() {
	return (
`<svg class="icone-filtro" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	<path fill-rule="evenodd" d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
</svg>`);
}
