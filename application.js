// http://detectmobilebrowsers.com/
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))window.isMobileDevice=true})(navigator.userAgent||navigator.vendor||window.opera);

// Application bootstrap
document.addEventListener("DOMContentLoaded", function(event) {
    // Fixed Action Button (Materialize)
    var fabElements = document.querySelectorAll('.fixed-action-btn');
    M.FloatingActionButton.init(fabElements, {
		direction: 'top',
		hoverEnabled: false
	});

	// Modal (Materialize)
	var modalElements = document.querySelectorAll('.modal');
    M.Modal.init(modalElements, {
		startingTop: '5%',
		endingTop: '5%'
	});

	// Tooltip only in desktop devices (Materialize)
	if (!window.isMobileDevice) {
		var tooltipElements = document.querySelectorAll('.tooltipped');
		M.Tooltip.init(tooltipElements, {});
	}
    
	// Build project information, chart (AMCHARTS) and table (DataTables)
	if (deepBNDESDataset) {
		buildProjectInformation(deepBNDESDataset);
		buildInvestmentFundChart(deepBNDESDataset);
		buildInvestmentFundTable(deepBNDESDataset);
	}
});

function buildProjectInformation(deepBNDESDataset) {
	var projectInformation = document.getElementById('project-information');
	if (projectInformation && Array.isArray(deepBNDESDataset))
		projectInformation.textContent = 'Nº de fundos: ' + deepBNDESDataset.length + ', Ano de ref. (BNDES): 2021';
}

function buildInvestmentFundChart(dataset) {
	am4core.ready(function() {
		am4core.useTheme(am4themes_animated);
		
		var chart = am4core.create("amcharts-force-directed-tree", am4plugins_forceDirected.ForceDirectedTree);
		chart.language.locale = am4lang_pt_BR;
		chart.events.on('ready', function() {
			var loadingElement = document.getElementById('loading');
			if (loadingElement)
				loadingElement.style.display = 'none';
		});
		
		// Network series configuration (ForceDirectedSeries)
		var networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());
		networkSeries.maxLevels = 1;
		networkSeries.centerStrength = 1.2;
		networkSeries.manyBodyStrength = -16;
		networkSeries.dataFields.name = "label";
		networkSeries.dataFields.value = "value";
		networkSeries.dataFields.children = "children";
		networkSeries.minRadius = 20;
		networkSeries.maxRadius = window.isMobileDevice ? 40 : 80;
		networkSeries.linkWithStrength = 0;
		networkSeries.fontSize = 10;
		networkSeries.tooltip.fontSize = 12;
		networkSeries.tooltip.label.wrap = true;
		networkSeries.tooltip.label.maxWidth = window.isMobileDevice ? 250 : 400;
		
		// Network series links configuration
		var linkTemplate = networkSeries.links.template;
		var linkHoverState = linkTemplate.states.create("hover");
		linkTemplate.strokeWidth = 1;
		linkTemplate.strokeOpacity = 0.5;
		linkTemplate.distance = 1.5;
		linkHoverState.properties.strokeWidth = 2;
		linkHoverState.properties.strokeOpacity = 1;
		
		// Network series node template configuration
		var nodeTemplate = networkSeries.nodes.template;
		nodeTemplate.expandAll = false;
		nodeTemplate.fillOpacity = 0.8;
		nodeTemplate.label.fill = am4core.color("#000");
		nodeTemplate.label.hideOversized = true;
		nodeTemplate.label.truncate = true;
		nodeTemplate.label.adapter.add("text", function(input, target) {
			if (target.dataItem) {
				return target.dataItem._dataContext.iconPath ? null : "{label}";
			}
			return input;
		});
		
		// Node template tooltip configuration
		nodeTemplate.adapter.add("tooltipText", function(input, target) {
			var text = "[bold]{label}[/]";
			if (target.dataItem) {
				var fundText = "\nCNPJ: {customData.cnpj}\nDenominação social: {customData.denominacao_social}";
				var fundBNDEStext = "\nParticipação do BNDES: {customData.participacao_bndes.formatNumber('##.00')}%";
				var fundCVMText = "\nPatrimínio Líq.: R$ {customData.patrimonio_liquido.formatNumber('#,###.')}\nN. total de cotistas: {customData.total_cotistas_subscritores}\nData de ref. (CVM): {customData.data_referencia_fundo}";
				if (target.dataItem.level == 0) {
					text += fundText + fundBNDEStext;
					if (target.dataItem._dataContext.customData.data_referencia_fundo != 'N/A') {
						text += fundCVMText;
					}
				} else {
					var assetText = "\nTipo (ativo): {customData.tipo_aplicacao} / {customData.tipo_ativo}\nDescrição: {customData.descricao}";
					assetText += "\nValor de mercado: R$ {customData.valor_mercado.formatNumber('#,###.')}\nData de ref. (ativo): {customData.data_referencia_ativo}";
					if (target.dataItem._dataContext.customData.bloco == 2) {
						text += assetText + "\nCNPJ: {customData.cnpj}";
						if (target.dataItem._dataContext.customData.data_referencia_fundo != 'N/A') {
							text += fundCVMText;
						}
					} else {
						text += assetText;
					}
				}

				var observation = '\nObs.:';
				if (target.dataItem.level == 0 || target.dataItem._dataContext.customData.bloco == 2) {
					var referenceDate = target.dataItem._dataContext.customData.data_referencia_fundo;
					if (referenceDate === 'N/A') {
						observation += ' CNPJ não encontrado no dataset CVM Inf. Tri. (2021);';
					}
					if (target.dataItem.level == 2) {
						observation += ' Versão beta, visualização limitada em níveis;';
					} else {
						var children = target.dataItem._dataContext.children;
						if (!Array.isArray(children) || !children.length) {
							observation += ' CNPJ não encontrado no dataset CVM CDA (2021);';
						}
					}
				}
				if (observation === '\nObs.:') {
					observation += ' N/A';
				}

				text += observation;
			}
			return text;
		});
		
		// Node template events configuration
		nodeTemplate.events.on("over", function (event) {
		    event.target.dataItem.childLinks.each(function (link) {
		        link.isHover = true;
		    });
		});
		nodeTemplate.events.on("out", function (event) {
		    event.target.dataItem.childLinks.each(function (link) {
		        link.isHover = false;
		    });
		});
		nodeTemplate.events.on("hit", function(event) {
			if (event.target.isActive) {
				networkSeries.nodes.each(function(node) {
					if (event.target !== node && node.isActive && event.target.dataItem.level == node.dataItem.level) {
						node.isActive = false;
					}
				});
			}
		});
		
		// Node template icon configuration
		var nodeIcon = nodeTemplate.createChild(am4core.Image);
		nodeIcon.propertyFields.href = "iconPath";
		nodeIcon.horizontalCenter = "middle";
		nodeIcon.verticalCenter = "middle";
		nodeIcon.width = 22;
		nodeIcon.height = 22;
		
		networkSeries.data = dataset;
	});
}

function buildInvestmentFundTable(dataset) {
	$('#datatable').DataTable({
		responsive: true,
		paging: true,
		data: dataset,
		columns: [
			{ title: 'Sigla', data: 'customData.sigla', render: getDataTablesInitials },
			{ title: 'CNPJ', data: 'customData.cnpj' },
			{ title: 'Patrimônio Líq.', data: 'customData.patrimonio_liquido', render: getDataTablesMonetaryValue },
			{ title: 'Participação do BNDES', data: 'customData.participacao_bndes', render: getDataTablesPercentage },
			{ title: 'Cotistas subscritores', data: 'customData.total_cotistas_subscritores' },
			{ title: 'Data de ref. (CVM)', data: 'customData.data_referencia_fundo' },
			{ title: 'Composição', data: 'children', render: getDataTablesCompositionIcons }
		],
		"columnDefs": [{ "targets": 6, "orderable": false }],
		'language': getDataTablesI18nPTBRConfig()
	});
}

function getDataTablesInitials(data, type, row) {
	if(type == 'display') {
		return data + ' <i class="material-icons tiny" title="Denominação social: ' + row.customData.denominacao_social + '">info_outline</i>';
	}
	
	return data;
}

function getDataTablesMonetaryValue(data, type, row) {
	if(type == 'display') {
		var formatter = new Intl.NumberFormat('pt-BR', { style: 'decimal' });
		return 'R$ ' + formatter.format(data);
	}
	
	return data;
}

function getDataTablesPercentage(data, type, row) {
	if(type == 'display') {
		return Number(data).toFixed(2).replace('.', ',') + '%';
	}

	return data;
}

function getDataTablesCompositionIcons(data, type, row) {
	if(type == 'display') {
		var content = '';
		if (Array.isArray(data) && data.length) {
			var uniqueIdentifier = [];
			data = data.sort(function(a, b) { return a.customData.bloco - b.customData.bloco; });
			data.forEach(function(item) {
				if (uniqueIdentifier.indexOf(item.customData.bloco) === -1) {
					uniqueIdentifier.push(item.customData.bloco);
					content += '<img class="responsive-img composition-icon" title="' + item.customData.bloco_titulo + '" src="image/asset-type/type-' + item.customData.bloco + '.png"></img>';
				}
			});
		}
		return content;
	}

	return data;
}

function getDataTablesI18nPTBRConfig() {
	return {
		'sEmptyTable': 'Nenhum registro encontrado',
		'sInfo': 'Mostrando de _START_ até _END_ de _TOTAL_ registros',
		'sInfoEmpty': 'Mostrando 0 até 0 de 0 registros',
		'sInfoFiltered': '(Filtrados de _MAX_ registros)',
		'sInfoPostFix': '',
		'sInfoThousands': '.',
		'sLengthMenu': '_MENU_ resultados por página',
		'sLoadingRecords': 'Carregando...',
		'sProcessing': 'Processando...',
		'sZeroRecords': 'Nenhum registro encontrado',
		'sSearch': 'Pesquisar',
		'oPaginate': {
			'sNext': 'Próximo',
			'sPrevious': 'Anterior',
			'sFirst': 'Primeiro',
			'sLast': 'Último'
		},
		'oAria': {
			'sSortAscending': ': Ordenar colunas de forma ascendente',
			'sSortDescending': ': Ordenar colunas de forma descendente'
		},
		'select': {
			'rows': {
				'_': 'Selecionado %d linhas',
				'0': 'Nenhuma linha selecionada',
				'1': 'Selecionado 1 linha'
			}
		},
		'thousands': '.',
		'decimal': ','
	};
}