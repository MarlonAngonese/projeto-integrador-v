function insertCategories (event) {

	event.preventDefault();

	var name = $("#name").val();
	var category = $("#category").val();

	if (name == "") {
		toastr["error"]("Campo categoria obrigatório");
		return
	}

	if (category == "") {
		toastr["error"]("Campo categoria obrigatório");
		return
	} else {
		var data = {
			name: name,
			slug: category
		}

		$.post('/admin/categories/add', data, function (res) {
			if(res === 'ok') {
				toastr["success"]("Categoria cadastrada com sucesso!");
				setTimeout(function(){
					location.href = '/admin/categories/list'
				},1500);
			} else {
				toastr["error"]("Erro: " + res);
			}
		});
  	}
}

// EXCLUIR ITENS DA TABELA
$('.btn-remove').click(function () {
	$.ajax({
		url: '/admin/category/delete/' + $(this).attr('id'),
		type: 'delete',
		success: function (r) {
			if (r == 'ok') {
				toastr["success"]("Categoria excluida!");
			setTimeout(function(){
				location.reload();
			},1500);
			} else {
				toastr["error"]("Categorias ", "Erro na exclusao");
			}
		}
	});
});