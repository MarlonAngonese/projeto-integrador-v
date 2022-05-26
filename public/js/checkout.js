var cart = sessionStorage.getItem("cart");
cart = JSON.parse(cart);
console.log(cart);

function toBrDigits (number) {
    return number.toLocaleString('pt-BR', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });
}

function getClientInfo() {
    // $.ajax({
    //     url: "/login",
    //     method: 'GET',
    //     success: function(response) {
    //       if (response) {
    //         console.log("success", response)
    //       }
    //     },
    //     error: function(erro) {
    //         console.log("erro", erro);
    //     }
    //   });
}

function showItemsCheckout () {
    if (cart !== null) {
      var listCart = $('<ul class="list-unstyled"></ul>');
      var total = 0;

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

//

$(document).ready(function () {
    showItemsCheckout();
    getClientInfo();
});