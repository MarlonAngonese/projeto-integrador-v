function sendContact(event) {
    event.preventDefault();
    var id = $("#client-id")[0].innerText;
    var email = $("#email-contact")[0].innerText;
    var subject = $("#subjec-contact")[0].innerText;
    var description = $("#description-contact")[0].innerText;
    var answer = $("#description").val();

    if (answer == "") {
        toastr["error"]("Campo resposta obrigatório");
        return;
    }
  
    var data = {
        id: id,
        email: email,
        subject: subject,
        description: description,
        answer: answer,
    }

    $.post('/send', data, function (res) {
        if(res.success) {
            toastr["success"]("Resposta enviada com sucesso");

            setTimeout(function() {
                location.reload();
            },2500);

            $('form').trigger('reset');
        } else {
            toastr["error"]("Erro ao enviar resposta");
        }
    })
    
}