$(document).ready(function() {

    // Inserir produtos na lista
    $("#send-button").click(function() {
        var data = new FormData($('#product-form')[0]);
        $.ajax({
            url:'/insertProducts',
            type: 'POST',
            contentType: false,
            processData: false,
            cache: false,
            data: data,
            success: function(res){
                if (res.status == 200) {
                    toastr["success"]("Produto inserido com sucesso!");

                    return setTimeout(() => {
                        location.reload();
                    }, 1500)
                }

                return toastr["error"]("Produtos ", "Erro na inserção");
            },
            error: () => {
                toastr["error"]("Produtos ", "Erro na inserção");
            }
        })
    });

    // EXCLUIR ITENS DA TABELA
    $('.btn-remove').click(function () {
        $.ajax({
            url: '/product/' + $(this).attr('id'),
            type: 'delete',
            success: function (r) {
                if (r == 'ok') {
                    toastr["success"]("Produto excluido!");
                setTimeout(function(){
                    location.reload();
                },1500);
                } else {
                    toastr["error"]("Produtos ", "Erro na exclusao");
                }
            }
        });
    });
});