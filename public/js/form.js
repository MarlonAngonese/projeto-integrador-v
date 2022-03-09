function send (event) {

    event.preventDefault();
    console.log(event);
  
    var id = $("#id").val();
    var name = $("#name").val();
    var lastname = $("#lastname").val();
    var email = $("#email").val();
    var password = $("#password").val();
  
    // Validations
    if (name == "") {
        toastr["error"]("Campo nome obrigatório");
        return;
    }
  
    if (lastname == "") {
        toastr["error"]("Campo sobrenome obrigatório");
        return
    }
  
    if (email == "") {
        toastr["error"]("Campo email obrigatório");
        return
    }
  
    if (id == "" || (id.length > 0 && password.length > 0)) {
        if (password == "") {
            toastr["error"]("Campo senha obrigatório");
            return
        }
    }
  
    var data = {
        name: name,
        lastname: lastname,
        email: email,
        password: password
    }

    if (id.length == 0) {
        $.post('/client', data, function (res) {
            if(res === 'ok') {
                toastr["success"]("Cadastro realizado com sucesso!");
                setTimeout(function(){
                location.reload();
                },1500);
                $('form').trigger('reset');
            } else {
                toastr["error"]("Erro: " + res);
            }
        })
    }
}