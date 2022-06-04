function send (event) {
    event.preventDefault();
  
    var createAccount = false;

    // Get input values
    var name = $("#name").val();
    var lastname = $("#lastname").val();
    var cpf = $("#cpf").val();
    var email = $("#email").val();
    var birthday = $("#birthday").val();
    var cellphone = $("#cellphone").val();
    var cep = $("#cep").val();
    var city = $("#city").val();
    var neighborhood = $("#neighborhood").val();
    var address = $("#address").val();
    var number = $("#number").val();
    var complement = $("#complement").val();
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();

    var verifyFirstName = namesValidations(name);
    var verifyLastName = namesValidations(lastname);
    var verifyCpf = cpfValidation(cpf);
    var verifyEmail = emailValidation(email);

    var verifyCity = especialLettersValidation(city);
    var verifyNeighborhood = especialLettersValidation(neighborhood);
    var verifyaddress = especialLettersValidation(address);
    var verifyComplement = especialLettersValidation(complement);

    // Name
    if (!verifyFirstName) {
        createAccount = false;
        $("#name").addClass('invalid');
        toastr["error"]("Campo nome inválido");
        return;
    } else {
        $("#name").removeClass('invalid');
        createAccount = true
    }

    // Lastname
    if (!verifyLastName) {
        createAccount = false;
        $("#lastname").addClass('invalid');
        toastr["error"]("Campo sobrenome inválido");
        return;
    } else {
        $("#lastname").removeClass('invalid');
        createAccount = true
    }

    // Cpf
    if (!verifyCpf) {
        createAccount = false;
        $("#cpf").addClass('invalid');
        toastr["error"]("Campo cpf inválido");
        return;
    } else {
        $("#cpf").removeClass('invalid');
        createAccount = true
    }

    // Email
    if (!verifyEmail) {
        createAccount = false;
        $("#email").addClass('invalid');
        toastr["error"]("Campo sobrenome inválido");
        return;
    } else {
        $("#email").removeClass('invalid');
        createAccount = true
    }

    // Birthday
    if (!birthday || birthday == "") {
        createAccount = false;
        $("#birthday").addClass('invalid');
        toastr["error"]("Campo data de nascimento inválido");
        return;
    } else {
        $("#birthday").removeClass('invalid');
        createAccount = true
    }

    // cellphone
    if (!cellphone || cellphone == "" || cellphone.length != 11) {
        createAccount = false;
        $("#cellphone").addClass('invalid');
        toastr["error"]("Campo celular inválido");
        return;
    } else {
        $("#cellphone").removeClass('invalid');
        createAccount = true
    }

    // Cep
    if (!cep || cep.length != 8 || cep == "") {
        createAccount = false;
        $("#cep").addClass('invalid');
        toastr["error"]("Campo cep inválido");
        return;
    } else {
        $("#cep").removeClass('invalid');
        createAccount = true
    }

    // City
    if (verifyCity || city == "") {
        createAccount = false;
        $("#city").addClass('invalid');
        toastr["error"]("Campo cidade inválido");
        return;
    } else {
        $("#city").removeClass('invalid');
        createAccount = true
    }

    // Neighborhood
    if (verifyNeighborhood || neighborhood == "") {
        createAccount = false;
        $("#neighborhood").addClass('invalid');
        toastr["error"]("Campo bairro inválido");
        return;
    } else {
        $("#neighborhood").removeClass('invalid');
        createAccount = true
    }

    // Address
    if (verifyaddress || address == "") {
        createAccount = false;
        $("#address").addClass('invalid');
        toastr["error"]("Campo rua inválido");
        return;
    } else {
        $("#address").removeClass('invalid');
        createAccount = true
    }

    // Complement
    if (verifyComplement) {
        createAccount = false;
        $("#complement").addClass('invalid');
        toastr["error"]("Campo complemento inválido");
        return;
    } else {
        $("#complement").removeClass('invalid');
        createAccount = true
    }

    // Number
    if (!number || number == "" || number.length > 5) {
        createAccount = false;
        $("#number").addClass('invalid');
        toastr["error"]("Campo npumero inválido");
        return;
    } else {
        $("#number").removeClass('invalid');
        createAccount = true
    }

    // Password
    if (!password || password == "") {
        createAccount = false;
        $("#password").addClass('invalid');
        toastr["error"]("Campo senha inválido");
        return;
    } else {
        $("#password").removeClass('invalid');
        createAccount = true
    }

    // Password specifications
    if (password.length <= 5) {
        createAccount = false;
        $("#password").addClass('invalid');
        toastr["error"]("Mínimo de 5 caracteres para senha");
        return;
    } else {
        $("#password").removeClass('invalid');
        createAccount = true
    }

    // Confirm password
    if (!confirmPassword || confirmPassword == "") {
        createAccount = false;
        $("#confirmPassword").addClass('invalid');
        toastr["error"]("Campo confirmar senha inválido");
        return;
    } else {
        $("#confirmPassword").removeClass('invalid');
        createAccount = true
    }

    // Verify password and confirm password
    if (password != confirmPassword) {
        createAccount = false;
        $("#password").addClass('invalid');
        $("#confirmPassword").addClass('invalid');
        toastr["error"]("Senhas incompatíveis");
        return;
    } else {
        $("#password").removeClass('invalid');
        $("#confirmPassword").removeClass('invalid');
        createAccount = true
    }

    if (createAccount) {
        // Create data payload
        var data = {
            name: name,
            lastname: lastname,
            cpf: cpf,
            email: email,
            birthday: birthday,
            cellphone: cellphone,
            cep: cep,
            city: city,
            neighborhood: neighborhood,
            street: address,
            number: number,
            complement: complement,
            password: password,
            confirmPassword: confirmPassword
        }

        // Front router to post new client on MongoDB
        $.post('/register', data, function (res) {
            if(res === 'ok') {
                toastr["success"]("Cadastro realizado com sucesso!");
                setTimeout(function(){
                location.reload();
                },1500);
                $('form').trigger('reset');
            } else {
                toastr["error"]("Erro: " + res);
            }
        });
    }
}

function cpfValidation(val) {
    if (val) {
        var add, rev, i;
        val = val.replace(/[^\d]+/g, '');

        if (val.length == 11) {
            if (val == "00000000000" || val == "11111111111" ||
                val == "22222222222" || val == "33333333333" ||
                val == "44444444444" || val == "55555555555" ||
                val == "66666666666" || val == "77777777777" ||
                val == "88888888888" || val == "99999999999") return false;
            add = 0;

            for (i = 0; i < 9; i++)
                add += parseInt(val.charAt(i)) * (10 - i);
            rev = 11 - (add % 11);

            if (rev == 10 || rev == 11)
                rev = 0;

            if (rev != parseInt(val.charAt(9)))
                return false;
            add = 0;

            for (i = 0; i < 10; i++)
                add += parseInt(val.charAt(i)) * (11 - i);
            rev = 11 - (add % 11);

            if (rev == 10 || rev == 11)
                rev = 0;
                
            if (rev != parseInt(val.charAt(10)))
                return false;
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function emailValidation(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function namesValidations(name) {
    var regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/
    return regex.test(name);
}

function especialLettersValidation(name) {
    var regex = /(?=.*[}{,.$%¨'!#&*()^?~=+\_\*\-+.\|])/
    return regex.test(name);
}

$("#cep").keyup(function() {
    var cep = $(this).val().replace(/\D/g, '');

    if (cep.length>="8") {
        var validacep = /^[0-9]{8}$/;

        if(validacep.test(cep)) {
            $("#address").val("...");
            $("#neighborhood").val("...");
            $("#city").val("...");
            $("#state").val("...");
            $("#complement").val("...");

            $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {
                console.log(dados);
                if (!("erro" in dados)) {
                    $("#address").val(dados.logradouro);
                    $("#neighborhood").val(dados.bairro);
                    $("#city").val(dados.localidade);
                    $("#state").val(dados.uf);
                    $("#complement").val(dados.complemento);
                } 
                else {
                    toastr["error"]("CEP não encontrado");
                    // alert("CEP não encontrado.");
                }
            });
        }
        else {
            // alert("Formato de CEP inválido.");        
            toastr["error"]("Formato de CEP inválido");
        }
    }
    else {
        // toastr["error"]("Erro ao capturar endereço");
    }
});