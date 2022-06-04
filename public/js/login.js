$(document).ready(function() {

    // Inserir produtos na lista
    $("#button-login").click(function() {
        var data = new FormData($('#login-form')[0]);
        return console.log(data);
        $.ajax({
            url:'/login',
            type: 'POST',
            data: data,
            success: function(res){
                if (res.status == 200) {
                    console.log(res);
                }
            },
            error: () => {
                toastr["error"]("Login", "E-mail ou senha incorretos. Tente novamente!");
            }
        })
    })
})