'use strict';

function recrieTBody(table, rows) {
	const tbody = table.querySelector('tbody');
	table.removeChild(tbody);
	table.appendChild(
		crie('tbody', rows, tbody.classList, tbody.id)
	);
	return table;
}

function adicioneEventOrdenacao(table, th, propriedade, array, crieRows) {
	const asc = 'a';
	const desc = 'd';
	if (th.eventOrdenacao) {
		th.removeEventListener('click', th.eventOrdenacao);
	}
	th.eventOrdenacao = () => {
		if (th.ordem !== asc) {
			recrieTBody(
				table,
				crieRows(ordemAscendente(array, propriedade))
			);
			th.ordem = asc;
		} else {
			recrieTBody(
				table,
				crieRows(ordemDescendente(array, propriedade))
			);
			th.ordem = desc;
		}
	};
	th.addEventListener('click', th.eventOrdenacao);
	th.style.cursor = 'pointer';
}

function adicioneEventOrdenacoes(table, headers, array, crieRows) {
	for (const h of headers) {
		adicioneEventOrdenacao(table, h.th, h.propriedade, array, crieRows);
	}
}
