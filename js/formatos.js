'use strict';

function paraDatalocalTime(data) {
	let dlt = '';
	if (data !== '') {
		const txt = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})/.exec(data);
		if (txt && txt.length == 5) {
			dlt = `${txt[3]}-${txt[2]}-${txt[1]}T${txt[4]}:00`;
		}
	}
	return dlt;
}

function paraData(dtl) {
	let data = '';
	if (dtl !== '') {
		const txt = /(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/.exec(dtl);
		if (txt.length === 5) {
			data = `${txt[3]}/${txt[2]}/${txt[1]} ${txt[4]}`;
		}
	}
	return data;
}

function coloqueZero(data) {
	return (data > 9)? data : '0' + data;
}

function paraTitulo(palavra) {
	return palavra[0].toUpperCase() + palavra.slice(1);
}

function termoTipoAudio(nome) {
	return (nome !== 'efeito-sonoro')? paraTitulo(nome) : 'Efeito Sonoro';
}

function formateDateTime(dateTime) {
	const dia = dateTime.slice(8, 10);
	const mes = dateTime.slice(5, 7);
	const ano = dateTime.slice(0, 4);
	const horas = dateTime.slice(11, 13);
	const minutos = dateTime.slice(14, 16);
	return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

function formateSegundos(segundos) {
	const h = complementeZero(Math.floor(segundos / 3600));
	const m = complementeZero(Math.floor(segundos % 3600 / 60));
	const s = complementeZero(segundos % 3600 % 60);
	return `${h}:${m}:${s}`;
}

function complementeZero(unidade) {
	return (unidade > 9)? unidade : '0' + unidade;
}

