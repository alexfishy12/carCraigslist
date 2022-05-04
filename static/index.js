//set global variables
var username;
var allListings;
var filters;
var base = "http://127.0.0.1:5000/";

//when html is done loading
$(document).ready(function(){
	// Check if this base element exists
	if($("#carMenu").length) {
		loadListings("#carMenu", "getListings");
	}

	if($("#yourListings").length) {
		loadListings("#yourListings", "getMyListings", true, true);
	}

	if($("#savedListings").length) {
		loadListings("#savedListings", "getSavedListings", true);
	}

	if($("#savedOffers").length) {
		loadListings("#savedOffers", "getSavedOffers", true);
	}

	//loadListings("#yourListings");
    //buildMenu(allListings);

	$("#filter").on("change", function(){
		filters = getFilters();
		console.log("filters:");
		console.log(filters);
	});

	$("#applyFilters").on("click", function(){
		filterListings(filters);
	})

	$("#listCar").submit(function(e){
		e.preventDefault();
		console.log("Submitting car listing...");
		$("#listCarModal").modal("hide");
		$("#listCar").trigger("reset");
	})

	$("#sendOffer").submit(function(e){
		e.preventDefault();
		getOfferDetails();
		$("#offerModal").modal('hide');
        $("#sendOffer").trigger('reset');
	})
})

//getOfferDetails from form in offer modal
function getOfferDetails()
{
	var offerlid = $("#offerlid").val();
	var amount = $("#offerAmount").val();

	saveOffer(offerlid, amount);
}

//loads listings from database onto page
function loadListings(base, endpoint, reduced, showOffers){
    getListings(endpoint).done(function(response){
        if(response.includes("ERROR"))
        {
            console.log("ERROR");
            console.log(response[0]);
        }
        else
        {
            buildMenu(response, base, reduced, showOffers);
			allListings = response;
			console.log(response)
        }
    });
}

//builds menu of listings in html to display on page
function buildMenu(listings, base, reduced, showOffers){
	$(base).html("");
    jQuery.each(listings, function(){
        var card = createListingCard(this, reduced, showOffers);
		console.log(card)
		card = card.replaceAll("img src=undefined", "img src=../static/pictures/car_placeholder.png");
        $(base).append(card);
    })
}

//filter listings
function filterListings()
{
	console.log("Applying filters...")
	//will contain only listings that pass through filter
	var filteredList = allListings.filter(function(listing)
	{
		return 	(filters.type == "" || filters.type == null || isNaN(filters.type) || listing.type == filters.type) &&
				(filters.make == "" || filters.make == null || isNaN(filters.make) || listing.make == filters.make) &&
				(filters.model == "" || filters.model == null || isNaN(filters.model) || listing.model == filters.model) &&
				(filters.color == "" || filters.color == null || isNaN(filters.color) || listing.color == filters.color) &&
				(filters.oldestYear == "" || filters.oldestYear == null || isNaN(filters.oldestYear) || filters.oldestYear <= listing.year) &&
				(filters.newestYear == "" || filters.newestYear == null || isNaN(filters.newestYear) ||  filters.newestYear >= listing.year) &&
				(filters.minPrice == "" || filters.minPrice == null || isNaN(filters.minPrice) ||  filters.minPrice <= listing.price) &&
				(filters.maxPrice == "" || filters.maxPrice == null || isNaN(filters.maxPrice) ||  filters.maxPrice >= listing.price) &&
				(filters.minMileage == "" || filters.minMileage == null || isNaN(filters.minMileage) ||  filters.minMileage <= listing.mileage) &&
				(filters.maxMileage == "" || filters.maxMileage == null || isNaN(filters.maxMileage) ||  filters.maxMileage >= listing.mileage);
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
	var minPrice = parseInt($("#filterMinPrice").val());
	var maxPrice = parseInt($("#filterMaxPrice").val());
	var oldestYear = parseInt($("#filterOldest").val());
	var newestYear = parseInt($("#filterNewest").val());
	var minMileage = parseInt($("#filterMinMileage").val());
	var maxMileage = parseInt($("#filterMaxMileage").val());

	return {type: type, make: make, model: model, color: color, minPrice: minPrice, maxPrice: maxPrice, oldestYear: oldestYear, newestYear: newestYear, minMileage: minMileage, maxMileage: maxMileage};
}

//returns card html for one listing
function createListingCard(listing, reduced, showOffers){
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

	if (reduced){

		card += "<img src=" + imgSrc + " alt='' class='bd-placeholder-img card-img-top' width='100%' height='225'>" +
			"<div class='card-body'>" +
				"<h5 class='card-title'>" + listing.year + " " + listing.make + " " + listing.model + "</h5>" +
				"<h6 class='card-title'>Mileage: " + listing.mileage + "</h6>" +
				"<p class='card-text'>" +
					listing.color + " " + listing.type +
				"</p>" +
				"<span>Listing Price: </span><h5 class='card-title text-success'>" + "$" + listing.price.toLocaleString("en-US") + "</h5>" +
				"<div class='d-flex justify-content-between align-items-center'>";

				if(showOffers)
				{
					card += "<button type='button' class='btn btn-sm btn-outline-secondary' onclick='viewOffersModal(" + listing.lid + ")'>View Offers</button>";
				}
				card += "</div>"
			"</div>"
		"</div>"
	"</div>";
	}

	else {
		card += "<img src=" + imgSrc + " alt='' class='bd-placeholder-img card-img-top' width='100%' height='225'>" +
			"<div class='card-body'>" +
			"<h5 class='card-title'>" + listing.year + " " + listing.make + " " + listing.model + "</h5>" +
			"<h6 class='card-title'>Mileage: " + listing.mileage + "</h6>" +
			"<p class='card-text'>" +
			listing.color + " " + listing.type +
			"</p>" +
			"<span>Listing Price: </span><h5 class='card-title text-success'>" + "$" + listing.price.toLocaleString("en-US") + "</h5>" +
			"<div class='d-flex justify-content-between align-items-center'>" +
			"<div class='btn-group'>" +
			"<button type='button' class='btn btn-sm btn-outline-secondary' onclick='saveListing(" + listing.lid + ")'>Save</button>" +
			"<button type='button' class='btn btn-sm btn-outline-secondary' onclick='openOfferModal(" + listing.lid + ")'>Offer</button>" +
			"</div>"
		"</div>"
		"</div>"
		"</div>"
		"</div>";
	}

	if (listing.hasOwnProperty('offer')){
			card+="<span>Bid: </span><h5 class='card-title text-success'>" + "$" + listing.offer.toLocaleString("en-US") + "</h5>"
		}
	
    return card;
}

//open viewOffersModal
function viewOffersModal(lid)
{
	$("#offerList").html();
	getOffers(lid).done(function(response){
		var offerList = "";
		jQuery.each(response, function(){

			offerList += 	"<div class='row py-1'>" +
				"<div class='col'> <div class='row'><div class='col text-start'>" + this.name + "</div> <div class='col text-end text-success'>$" + this.amount.toLocaleString('en-us') + "</div> </div> </div>" +
								"<div class='col btn-group'>" +
									`<button class='btn btn-sm btn-outline-success' onclick='offerResponse(\"` + this.oid + `\", \"accepted\")'>Accept</button>` +
									`<button class='btn btn-sm btn-outline-danger' onclick='offerResponse(\"` + this.oid + `\", \"denied\")'>Deny</button>` +
							"</div></div>";
		})

		$("#offerList").html(offerList);
	});

	$("#viewOffersModal").modal("show");
}

function offerResponse(oid, status)
{
	var response = $.ajax({
		url: base + "/offerResponse",
		dataType: "text",
		type: "POST",
		data: {oid: oid, response: status},
		success: function(response, status) {
			console.log("AJAX Success.");
			return response;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("AJAX Error.");
			return XMLHttpRequest.responseText;
		}
	});

	console.log(response);
}

//save listing
function saveListing(lid)
{
	var response = $.ajax({
		url: base + "/saveListing",
		dataType: "text",
		type: "POST",
		data: {lid: lid},
		success: function(response, status) {
			console.log("AJAX Success.");
			return response;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("AJAX Error.");
			return XMLHttpRequest.responseText;
		}
	});

	console.log(response);
}

function openOfferModal(lid)
{
	$("#offerModal").modal("show");
	$("#offerlid").val(lid);
}

//save offer to database
function saveOffer(lid, amount)
{
	var response = $.ajax({
		url: base + "/saveOffer",
		dataType: "text",
		type: "POST",
		data: {lid: lid, offer: amount},
		success: function(response, status) {
			console.log("AJAX Success.");
			return response;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{
			console.log("AJAX Error.");
			return XMLHttpRequest.responseText;
		}
	});

	console.log(response);
}

//gets offers for specific lid
function getOffers(lid)
{
	return $.ajax({
		url: base + "getOffers",
		dataType: "json",
		type: "POST",
		data: {lid, lid},
		success: function(response, status) {
			console.log("AJAX Success.");
			return response;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("AJAX Error.");
			return XMLHttpRequest.responseText;
		}
	});
}

//gets all listings from database
function getListings(endpoint){
    return $.ajax({
        url: base + endpoint,
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
	const listings = [{lid: 1, uid: 1, price: 9999.99, created: "2022-4-17 12:00", make: "Toyota", model: "Corolla", year: "2010", mileage: "94930", type: "Sedan", color: "Gray"}, {lid: 2, uid: 2, price: 4999.49, created: "2022-4-18 12:00", make: "Honda", model: "Civic", year: "2003", mileage: "150930", type: "Coupe", color: "Blue"}, {lid: 3, uid: 3, price: 14999.99, created: "2022-4-10 12:00", make: "Hyundai", model: "Sonata", year: "2015", mileage: "50930", type: "Sedan", color: "Silver"}, {lid: 4, uid: 4, price: 19999.99, created: "2022-4-17 12:00", make: "Ford", model: "F-150", year: "2010", mileage: "94930", type: "Truck", color: "Black"}];
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