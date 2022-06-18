$(document).ready(function() {

    // Conferir se o usuário tentou fazer login
    $("#button-login").click(function() {
        var data = {
            email: $('#email').val(),
            password: $('#password').val()
        }

        $.ajax({
            url:'/login',
            type: 'post',
            contentType: 'application/json',
            processData: false,
            cache: false,
            data: JSON.stringify(data),
            success: function(res){
                if (res.status == 200) {     
                    return location.href = "/cart"
                }

                return toastr["error"]("Login ", "E-mail ou senha incorretos. Tente novamente!");
            },
            error: () => {
                return toastr["error"]("Login ", "E-mail ou senha incorretos. Tente novamente!");
            }
        })
    })
})