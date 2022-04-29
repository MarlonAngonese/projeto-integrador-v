function sendContact(event) {

    event.preventDefault();
  
    var email = $("#email").val();
    var subject = $("#subject").val();
    var description = $("#description").val();
  
    // Validations
    if (email == "") {
        toastr["error"]("Campo email obrigatório");
        return;
    }

    if (subject == "") {
        toastr["error"]("Campo assunto obrigatório");
        return;
    }

    if (description == "") {
        toastr["error"]("Campo descrição obrigatório");
        return;
    }
  
    var data = {
        email: email,
        subject: subject,
        description: description
    }

    $.post('/contact', data, function (res) {
        if(res.status == 200) {
            toastr["success"]("Agradecemos pelo contato, retornaremos em breve!");
            setTimeout(function(){
                location.reload();
            },4500);
            $('form').trigger('reset');
        } else {
            toastr["error"](res.message);
        }
    })
    
}