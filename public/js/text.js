function sendText(event) {

    event.preventDefault();
  
    var id = $("#id").val();
    var info = $("#text").val();
  
    // Validations
    if (info == "") {
        toastr["error"]("Campo nome obrigatório");
        return;
    }
  
    var data = {
        info: info
    }

    if (id.length == 0) {
        $.post('/text', data, function (res) {
            if(res === 'ok') {
                toastr["success"]("Anotação cadastrada com sucesso!");
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