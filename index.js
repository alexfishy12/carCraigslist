//set global variables
var username;
var allListings;
var filters;

//when html is done loading
$(document).ready(function(){
	allListings = tempListings();
    buildMenu(allListings);

	$("#filter").on("change", function(){
		filters = getFilters();
		console.log(filters);
	});

	$("#applyFilters").on("click", function(){
		filterListings(filters);
	})
})

//loads listings from database onto page
function loadListings(){
    getListings().done(function(response){
        if(response[0].includes("ERROR"))
        {
            console.log("ERROR");
            console.log(response[0]);
        }
        else
        {
            buildMenu(response);
			allListings = response;
        }
    });
}

//builds menu of listings in html to display on page
function buildMenu(listings){
	$("#carMenu").html("");
    jQuery.each(listings, function(){
        var card = createListingCard(this);
        $("#carMenu").append(card);
    })
}

//filter listings
function filterListings()
{
	console.log("Applying filters...")
	//will contain only listings that pass through filter
	var filteredList = allListings.filter(function(listing)
	{
		return 	(filters.type == "" || listing.type == filters.type) &&
				(filters.make == "" || filters.make == null || listing.make == filters.make) &&
				(filters.model == "" || filters.model == null || listing.model == filters.model) &&
				(filters.color == "" || filters.color == null || listing.color == filters.color);
	});

	buildMenu(filteredList);
}

//takes form data from filter form
function getFilters()
{
	console.log("getting filters");
	var type = $("#filterType").val();
	var make = $("#filterMake").val();
	var model = $("#filterModel").val();
	var color = $("#filterColor").val();
	var minPrice = $("#filterMinPrice").val();
	var maxPrice = $("#filterMaxPrice").val();
	var oldestYear = $("#filterOldest").val();
	var newestYear = $("#filterNewest").val();
	var minMileage = $("#filterMinMileage").val();
	var maxMileage = $("#filterMaxMileage").val();
	var maxSellerDistance = $("#filterMaxSellerDistance").val();

	return {type: type, make: make, model: model, color: color, minPrice: minPrice, maxPrice: maxPrice, oldestYear: oldestYear, newestYear: newestYear, minMileage: minMileage, maxMileage: maxMileage, maxSellerDistance: maxSellerDistance};
}

//returns card html for one listing
function createListingCard(listing){
    var imgSrc;
    var card = "<div class='col'>" +
        "<div class='card shadow-sm'>";
        
    if (listing.photo)
    {
        //decode photo from blob
        var decodedImg = listing.photo //decode()
        
        imgSrc = decodedImg;
    }  
    else
    {
        switch(listing.type){
			case "Sedan":
				imgSrc = "'pictures/sedanPlaceholder.jpg'";
				break;
			case "Coupe":
				imgSrc = "'pictures/coupePlaceholder.jpg'";
				break;
			case "Truck":
				imgSrc = "'pictures/truckPlaceholder.png'";
				break;
			case "Hatchback":
				imgSrc = "'pictures/hatchbackPlaceholder.png'";
				break;
        }
    }
             
    card += "<img src=" + imgSrc + " alt='' class='bd-placeholder-img card-img-top' width='100%' height='225'>" + 
			"<div class='card-body'>" +
				"<h5 class='card-title'>" + listing.year + " " + listing.make + " " + listing.model + "</h5>" +
				"<h6 class='card-title'>Mileage: " + listing.mileage + "</h6>" +
				"<p class='card-text'>" +
					listing.color + " " + listing.type +
				"</p>" +
				"<span>Listing Price: </span><h5 class='card-title text-success'>" + listing.price + "</h5>" +
				"<div class='d-flex justify-content-between align-items-center'>" +
					"<div class='btn-group'>" +
						"<button type='button' class='btn btn-sm btn-outline-secondary'>Save</button>" +
						"<button type='button' class='btn btn-sm btn-outline-secondary'>Offer</button>" +
					"</div>"
				"</div>"
			"</div>"
		"</div>"
	"</div>";
    return card;
}


//gets all listings from database
function getListings(){
    return $.ajax({
        url: 'getListings.php',
        dataType: 'json',
        type: 'POST',
        success: function(response, status) {
            console.log("AJAX Success.");
            return response;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log("AJAX Error.");
            console.log(errorThrown);
        }
    });
}

function tempListings(){
	const listings = [{lid: 1, uid: 1, price: 9999.99, created: "2022-4-17 12:00", make: "Toyota", model: "Corolla", year: "2010", mileage: "94930", type: "Sedan", color: "Gray"}, {lid: 2, uid: 2, price: 4999.49, created: "2022-4-18 12:00", make: "Honda", model: "Civic", year: "2003", mileage: "150930", type: "Coupe", color: "Blue"}, {lid: 3, uid: 3, price: 14999.99, created: "2022-4-10 12:00", make: "Hyundai", model: "Sonata", year: "2015", mileage: "50930", type: "Sedan", color: "Silver"}];
	return listings;
}

//use function to get cookie from browser example: getCookie("username") will return stored username if cookie was set during login
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i <ca.length; i++) {
      	let c = ca[i];
      	while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
    return "";
}