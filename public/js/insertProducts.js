// EXCLUIR ITENS DA TABELA
$('.btn-remove').click(function () {
	$.ajax({
		url: '/product/' + $(this).attr('id'),
		type: 'delete',
		success: function (r) {
			if (r == 'ok') {
				toastr["error"]("Produto excluido!");
			setTimeout(function(){
				location.reload();
			},1500);
			} else {
				toastr["error"]("Produtos ", "Erro na exclusao");
			}
		}
	});
});