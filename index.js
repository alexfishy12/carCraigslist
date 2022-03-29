//set global variables
var username;

//when html is done loading
$(document).ready(function(){

})

//load menu of cars
function loadCars(){
    
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

//github test