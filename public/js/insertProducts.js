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
                return toastr["error"]("Produtos ", "Erro na inserção");
            }
        })
    });

    // Atualizar produto
    $("#update-button").click(function() {
        var data = new FormData($('#product-form')[0]);

        $.ajax({
            url:'/admin/products/update/' + $('#p-id').html(),
            type: 'POST',
            contentType: false,
            processData: false,
            cache: false,
            data: data,
            success: function(res){
                if (res.status == 200) {
                    toastr["success"]("Produto atualizado com sucesso!");

                    return setTimeout(() => {
                        location.reload();
                    }, 1500)
                }

                return toastr["error"]("Produtos ", "Erro na atualização");
            },
            error: () => {
                return toastr["error"]("Produtos ", "Erro na atualização");
            }
        })
    });

    // EXCLUIR ITENS DA TABELA
    $('.btn-remove').click(function () {
        $.ajax({
            url: '/admin/products/delete/' + $(this).attr('id'),
            type: 'delete',
            success: function (r) {
                if (r == 'ok') {
                    toastr["success"]("Produto excluido!");
                setTimeout(function(){
                    location.href = "/admin/products/list"
                },1500);
                } else {
                    toastr["error"]("Produtos ", "Erro na exclusao");
                }
            }
        });
    });
});