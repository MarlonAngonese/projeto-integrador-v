toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "1000",
  "hideDuration": "2000",
  "timeOut": "1500",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

var cart = sessionStorage.getItem("cart");
var total = 0;
cart = JSON.parse(cart);

function toBrDigits (number) {
    return number.toLocaleString('pt-BR', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });
}

function showItemsCheckout () {
  if (cart !== null) {
    var listCart = $('<ul class="list-unstyled"></ul>');

    for(var i in cart) {
      var li = $('<li class="list-prd"></li>');

      li.html(
        '<span class="product-name">' + cart[i].name + '(' + cart[i].quantity + ')' + '</span>' +
        '<span class="product-price">'+ toBrDigits(cart[i].price * cart[i].quantity) + '</span>'
        // '<span class="">Qtd: ' + cart[i].quantity + '</span>'
      );

      listCart.append(li);
      total += cart[i].price * cart[i].quantity;
    }

    $('#cart').html(listCart);
    $('#cart').append('<span class="total-cartt">Descontos <strong>' + toBrDigits(0) + '</strong></span>');
    $('#cart').append('<span class="total-cartt">Subtotal <strong>' + toBrDigits(total) + '</strong></span>');
    $('#cart').append('<span class="total-cartt">Total <strong>' + toBrDigits(total) + '</strong></span>');

    showCartItems();
  }
}

function mascara(o,f){
  v_obj=o
  v_fun=f
  setTimeout("execmascara()",1)
}

function execmascara(){
  v_obj.value=v_fun(v_obj.value)
}

function mcc(v){
  v=v.replace(/\D/g,"");
  v=v.replace(/^(\d{4})(\d)/g,"$1 $2");
  v=v.replace(/^(\d{4})\s(\d{4})(\d)/g,"$1 $2 $3");
  v=v.replace(/^(\d{4})\s(\d{4})\s(\d{4})(\d)/g,"$1 $2 $3 $4");
  return v;
}

function id( el ){
  return document.getElementById( el );
}

function createOrder(data) {
  $.ajax({
    url:'/insertOrders',
    type: 'POST',
    data: data,
    success: function(res){
        if (res.success) {
            toastr["success"]("Pedido enviado com sucesso!");

            return setTimeout(() => {
              window.location.href = "/confirmation";
            }, 1500)
        }

        return toastr["error"]("Pedidos ", "Erro na inser????o");
    },
    error: () => {
        return toastr["error"]("Pedidos ", "Erro na inser????o");
    }
  });
}

function getOrderInfos(payment) {
  $.ajax({
    url:'/admin/session/client',
    type: 'GET',
    success: function(res){
        if (res.client) {
          var client =  res.client;

          var data = {
            payment: payment,
            products: cart,
            client: client._id
          }

          createOrder(data);  
        } else {
          return toastr["error"]("Pedido", "Ocorreu um erro ao realizar seu pedido, tente novamente mais tarde");
        }

    },
    error: () => {
      return toastr["error"]("Pedido", "Ocorreu um erro ao realizar seu pedido, tente novamente mais tarde");
    }
})
}

function goToconfirmation(paymentType) {
  
  if (paymentType == "ticket") {
    getOrderInfos(paymentType);
  }

  if (paymentType == "pix") {
    getOrderInfos(paymentType);
  }

  if (paymentType == "card") {
    
    var cardNumber = $("#cc").val();
    var nameCard = $("#nameCard").val();
    var monthValidate = $("#monthValidate").val();
    var yearValidate = $("#yearValidate").val();
    var securityCode = $("#securityCode").val();
    var instalments = $("#instalments").val();
    var approveOrder = false;
  
    if (!cardNumber || cardNumber == "") {
      $("#cc").addClass("invalid");
      toastr["error"]("N??mero do cart??o obrigat??rio");
      approveOrder = false;
      return;
    } else {
      approveOrder = true;
      $("#cc").removeClass("invalid");
    }
  
    if (!nameCard || nameCard == "") {
      $("#nameCard").addClass("invalid");
      toastr["error"]("Nome no cart??o obrigat??rio");
      approveOrder = false;
      return;
    } else {
      approveOrder = true;
      $("#nameCard").removeClass("invalid");
    }
  
    if (!monthValidate || monthValidate == "") {
      $("#monthValidate").addClass("invalid");
      toastr["error"]("M??s de validade obrigat??rio");
      approveOrder = false;
      return;
    } else {
      approveOrder = true;
      $("#monthValidate").removeClass("invalid");
    }
  
    if (!yearValidate || yearValidate == "") {
      $("#yearValidate").addClass("invalid");
      toastr["error"]("Ano de validade obrigat??rio");
      approveOrder = false;
      return;
    } else {
      approveOrder = true;
      $("#yearValidate").removeClass("invalid");
    }
  
    if (!securityCode || securityCode == "" || securityCode.length != 3) {
      $("#securityCode").addClass("invalid");
      toastr["error"]("C??digo de seguran??a obrigat??rio");
      approveOrder = false;
      return;
    } else {
      approveOrder = true;
      $("#securityCode").removeClass("invalid");
    }
  
    if (!instalments || instalments == "") {
      $("#instalments").addClass("invalid");
      toastr["error"]("Parcela obrigat??rio");
      approveOrder = false;
      return;
    } else {
      approveOrder = true;
      $("#instalments").removeClass("invalid");
    }
  
    if (!approveOrder) {
      toastr["error"]("Revise seu pedido, consulte entradas inv??lidas");
    } else {
      getOrderInfos(paymentType);
    }
  }
}

$(document).ready(function () {
    showItemsCheckout();
});

window.onload = function(){
  id('cc').onkeypress = function(){
    mascara( this, mcc );
  }
}