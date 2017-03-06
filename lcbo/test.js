// enter spirits you have
// enter cocktails you may want to make
// cost per drink according to measurement
// user input recipe for drink - using lcbo pricing give cost per drink

// volume_in_milliliters
// price_per_liter_in_cents
// name
// producer_name
// primary_category:"Spirits"
// secondary_category:"Vodka"



// var cocktails = [
// {
// 	name: "Negroni",
// 	iOne: "1oz Gin",
// 	iTwo: "1oz Sweet Vermouth",
// 	iThree: "1oz Campari"
// }];
var drinksWidg = {};


drinksWidg.key = "MDphMmQxNzZiZS1mZDM5LTExZTYtYjQzZi02NzZjYTBlYTAxYTQ6NmZ2UXJsR0F1TDNFYW5QcVRIaDh2UDU5UWxzOWdEc1FZNEVD";


// $("#spirit").on('submit', function(e){
// 	e.preventDefault();
// 	drinksWidg.userInput = $("#spirit").val();
// });

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
		        per_page: 5,
		          q: input
		        },
		     success: function(result) {

		     	var list = $('#autocomplete');

		     	list.empty();

		     	for(var i=0; i<result.result.length; i++){

		     		list.append('<option value="' + result.result[i].name + '"></option>');
		     	}
		     }
		   });
		   // console.log(result);
});

var liquorStore = {};
var cocktailList = [];
var addOunce = $("#volume").val();

// call lcbo
drinksWidg.getLcbo = function(query){

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
	    //liquorStore += results;
	    // console.log('look at me', results);
	    results.map(function(res){
	    	// console.log(res);
	    	drinksWidg.displayDrinks(res);
	    	// var newItem = $("#results");
	    	// var drinkName = res.name;
	    	// var drinkPrice = res.price_per_liter_in_cents;
	    	// var drinkVol = res.volume_in_milliliters;
	    	// console.log(drinkVol, drinkName, drinkPrice);
	    	// var liquor = $("#results").append('<h2>' + drinkPrice + ' ' + drinkName + ' ' + drinkVol + 'mL'+ '</h2>');
	    });
	    //map loop through the array
	    //get all of the data
	    //display on the page
	});
	// console.log(results);
};

drinksWidg.displayDrinks = function(data){
	var drinkName = $("#results").append('<h2><a href="#" onclick="addSpirit(' + data.id + ')">'+data.name+'</a></h2>');
	liquorStore["s"+data.id] = data;
	//drinksWidg.displayDrinkName(drinkName);
};

drinksWidg.selectedDrinks = function(data){
	$("#results").selectable({

	});
};

drinksWidg.events = function() {
	$("form").on("submit", function(e){
		e.preventDefault();
		var usersChoice = $("#spirit").val();

		drinksWidg.getLcbo(usersChoice);

	});	
}

function addSpirit(spiritId){
	$("#cocktail").append('<li>'+liquorStore["s"+spiritId].name+'</li>');
	cocktailList.push(liquorStore["s"+spiritId]);
	updatePrice();
}

function updatePrice (){
	var literTotal = 0;
	for (i=0; i<cocktailList.length; i++){
		literTotal += cocktailList[i].price_per_liter_in_cents;
	}
	var ounceFactor = 33.814;
	var total = literTotal / ounceFactor;
	$("#totes").text("$"+(total/100)+"per drink");
}

// drinksWidg.number = function() {
// 	$("#volume").on("change", function(e){
// 		e.preventDefault();
// 		var ounce = drinkPrice
// 	});
// } 

// drinksWidg.getDrinks = function(drinks){
// 	// console.log("this this", drinks);

// 	// var liquor = $("#results").append(drinks.volume_in_milliliters);
// }

drinksWidg.init = function(){
	drinksWidg.events();
};

$(document).ready(function(){
	drinksWidg.init();
});