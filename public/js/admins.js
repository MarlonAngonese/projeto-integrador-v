function insertAdmins(event) {

	event.preventDefault();

	var name = $("#name").val();
	var password = $("#password").val();
    var email = $('#email').val();

	if (name == "") {
		toastr["error"]("Campo Nome obrigatório");
		return
	}

    if (email == "") {
        toastr["error"]("Campo E-mail obrigatório");
		return
    }

	if (password == "") {
		toastr["error"]("Campo Senha obrigatório");
		return
	} else {
		var data = {
			name: name,
            email: email,
			password: password
		}

		$.post('/admin/admins/add', data, function (res) {
			if(res === 'ok') {
				toastr["success"]("Administrador cadastrado com sucesso!");
				setTimeout(function(){
					location.href = '/admin/admins/list'
				},1500);
			} else {
				toastr["error"]("Erro: " + res);
			}
		});
  	}
}

function updateAdmins(event) {

	event.preventDefault();

	var name = $("#name").val();
	var password = $("#password").val();
    var email = $('#email').val();

	if (name == "") {
		toastr["error"]("Campo Nome obrigatório");
		return
	}

    if (email == "") {
        toastr["error"]("Campo E-mail obrigatório");
		return
    }

	if (password == "") {
		toastr["error"]("Campo Senha obrigatório");
		return
	} else {
		var data = {
			name: name,
            email: email,
			password: password
		}

		$.post('/admin/admins/update/' +  $('#p-id').html(), data, function (res) {
			if(res.status == 200) {
				toastr["success"]("Administrador atualizado com sucesso!");
				setTimeout(function(){
					location.href = '/admin/admins/list'
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
		url: '/admin/admins/delete/' + $(this).attr('id'),
		type: 'delete',
		success: function (r) {
			if (r == 'ok') {
				toastr["success"]("Administrador excluido!");
			setTimeout(function(){
				location.reload();
			},1500);
			} else {
				toastr["error"]("Administradores ", "Erro na exclusao");
			}
		}
	});
});