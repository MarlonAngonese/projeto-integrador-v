function addToCart (product) {
	var cart = JSON.parse(sessionStorage.getItem("cart"));
	if (!cart) {
		cart = [];
	}

	var find = cart.find(function (item) {
		return item._id === product._id;
	});

	if (find) {
		find.quantity++;
	} else {
		product.quantity = 1;
		cart.push(product);
	}
	toastr["success"](product.name + " adicionado ao carrinho");
	sessionStorage.setItem("cart", JSON.stringify(cart));
	setTimeout(function(params) {
		location.reload();
	},1500);
}

$(document).ready(function () {
	$('#addProduct').click(function () {
		var id = $('#productId').val();
		$.get('/api/product/' + id, function (product) {
			addToCart(product);
		})
	});
});


//////////////////

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}