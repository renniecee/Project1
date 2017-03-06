// enter spirits you have
// enter cocktails you may want to make
// cost per drink according to measurement
// user input recipe for drink - using lcbo pricing give cost per drink

var drinksWidg = {};

drinksWidg.key = "MDphMmQxNzZiZS1mZDM5LTExZTYtYjQzZi02NzZjYTBlYTAxYTQ6NmZ2UXJsR0F1TDNFYW5QcVRIaDh2UDU5UWxzOWdEc1FZNEVD";

drinksWidg.input = drinksWidg.userInput;

// autocomplete form
$('#spirit').keyup(function(){
			var input = $('#spirit').val();

	$.ajax({
		url: 'http://lcboapi.com/products?access_key=ACCESS_KEY',
		type: 'GET',
		dataType: 'jsonp',
		headers: {
		Authorization: "token" + drinksWidg.key,
		},
			data: {
			per_page: 9,
			q: input
		},
		success: function(result) {

		var list = $('#autocomplete');

		list.empty();

		for(var i=0; i<result.result.length; i++){

		list.append('<option class="dropdown" value="' + result.result[i].name + '"></option>');
			}
		}
	});
});

var liquorStore = {};
var cocktailList = [];


// call lcbo
drinksWidg.getLcbo = function(query){
	$("#results").html("");
	$.ajax({
	    url: 'http://proxy.hackeryou.com',
	    dataType: 'json',
	    method:'GET',
	    data: {
	        reqUrl: 'http://lcboapi.com/products',
	        params: {
	            key: drinksWidg.key,
	    		q: query
	        },
	        xmlToJSON: false
	    }
	}).then(function(res) {
	    var results = res.result;
	    results.map(function(res){
	    	drinksWidg.displayDrinks(res);
	    });
	});
};

// add initial filtered drinks list to page
drinksWidg.displayDrinks = function(data){
	var drinkName = $("#results").append('<h3><a href="#" onclick="addSpirit(' + data.id + ')">'+data.name+'</a></h3>');
	liquorStore["s"+data.id] = data;
};

var addOunce = $("#volume").val();

// submit initial filtered drinks to page
drinksWidg.events = function() {
	$("form").on("submit", function(e){
		e.preventDefault();
		var usersChoice = $("#spirit").val();

		drinksWidg.getLcbo(usersChoice);
	});	
}

// put drink & price in cocktail list
function addSpirit(spiritId){
	$("#cocktail").append('<li><input class="volume" value="1" type="number" min=".5" step=".5" onchange="updatePrice()"><span class="ounces">oz </span>' +liquorStore["s"+spiritId].name+'</li>');
	cocktailList.push(liquorStore["s"+spiritId]);
	updatePrice();
}


// price per ounce
function updatePrice (){
	var pricePerCocktail = 0;
	var ounceFactor = 33.814;
	for (i=0; i<cocktailList.length; i++){
		var ounces = $(".volume")[i].value;
		var priceLiterCents = cocktailList[i].price_per_liter_in_cents;
		var priceOunceDollars = (priceLiterCents/ounceFactor)/100;
		var subTotal = ounces * priceOunceDollars;
		pricePerCocktail += subTotal;
	}
	$("#totes").text("$"+ (pricePerCocktail).toFixed(2) +" per drink");

}


drinksWidg.init = function(){
	drinksWidg.events();
};

$(document).ready(function(){
	drinksWidg.init();

	// page load
	$('body').fadeIn(1000);
});