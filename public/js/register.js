function send (event) {

    event.preventDefault();
    console.log(event);
  
    // Get input values
    var name = $("#name").val();
    var lastname = $("#lastname").val();
    var cpf = $("#cpf").val();
    var email = $("#email").val();
    var birthday = $("#birthday").val();
    var cep = $("#cep").val();
    var neighborhood = $("#neighborhood").val();
    var street = $("#street").val();
    var number = $("#number").val();
    var complement = $("#complement").val();
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();

    // Validations
    if (name == "") {
        toastr["error"]("Campo nome obrigatório");
        return;
    }
    if (lastname == "") {
        toastr["error"]("Campo sobrenome obrigatório");
        return
    } 
    if (cpf == "") {
        toastr["error"]("Campo sobrenome obrigatório");
        return
    }     
    if (email == "") {  
        toastr["error"]("Campo email obrigatório");
        return
    }
    if (birthday == "") {
        toastr["error"]("Campo email obrigatório");
        return
    }
    if (cep == "") {
        toastr["error"]("Campo email obrigatório");
        return
    }
    if (neighborhood == "") {
        toastr["error"]("Campo email obrigatório");
        return
    }
    if (street == "") {
        toastr["error"]("Campo email obrigatório");
        return
    }
    if (number == "") {
        toastr["error"]("Campo email obrigatório");
        return
    }
    if (complement == "") {
        toastr["error"]("Campo email obrigatório");
        return
    }
    if (password == "") {
        toastr["error"]("Campo senha obrigatório");
        return
    }
    if (confirmPassword == "") {
        toastr["error"]("Campo email obrigatório");
        return
    }
  
    // Create data payload
    var data = {
        name: name,
        lastname: lastname,
        cpf: cpf,
        email: email,
        birthday: birthday,
        cep: cep,
        neighborhood: neighborhood,
        street: street,
        number: number,
        complement: complement,
        password: password,
        confirmPassword: confirmPassword
    }

    // Front router to post new client on MongoDB
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