function insertCategories (event) {

	event.preventDefault();

	var name = $("#name").val();
	var slug = $("#slug").val();

	if (name == "") {
		toastr["error"]("Campo categoria obrigatório");
		return
	}

	if (slug == "") {
		toastr["error"]("Campo categoria obrigatório");
		return
	} else {
		var data = {
			name: name,
			slug: slug
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

// Atualizar categoria da tabela
const updateCategories = (event) => {
	event.preventDefault();

	var name = $("#name").val();
	var slug = $("#slug").val();
	
	if (name == "") {
		toastr["error"]("Campo categoria obrigatório");
		return
	}
	
	if (slug == "") {
		toastr["error"]("Campo categoria obrigatório");
		return
	}
	
	var data = {
		name: name,
		slug: slug
	}
	
	$.post('/admin/categories/update/' +  $('#p-id').html(), data, function (res) {
		if(res.status == 200) {
			toastr["success"]("Categoria atualizada com sucesso!");
			setTimeout(function(){
				location.href = '/admin/categories/list'
			},1500);
		} else {
			toastr["error"]("Erro: " + res);
		}
	});
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