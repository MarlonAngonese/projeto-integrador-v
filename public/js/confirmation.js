var cart = sessionStorage.getItem("cart");
cart = JSON.parse(cart);
console.log(cart);

function toBrDigits (number) {
    return number.toLocaleString('pt-BR', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });
}

function showItemsCheckout () {
    if (cart !== null) {
      var listCart = $('<ul class="list-unstyled"></ul>');
      var total = 0;

      for(var i in cart) {
        var li = $('<li class="mb-5"></li>');
  
        li.html(
          '<h6>' + cart[i].name + '</h6>' +
          '<p>'+ toBrDigits(cart[i].price * cart[i].quantity) + '</p>' +
          '<p class="">QUANTIDADE: ' + cart[i].quantity + '</p>'
        ).append('<hr/>');
  
        listCart.append(li);
        total += cart[i].price * cart[i].quantity;
      }

      $('#cart').html(listCart);
      $('#cart').append('<p>Total <strong>' + toBrDigits(total) + '</strong></p>');

      showCartItems();
    }
  }

//

$(document).ready(function () {
    showItemsCheckout();
});