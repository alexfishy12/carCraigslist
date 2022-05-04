$(document).ready(function(){
    $("#createAccount").submit(function(e){
        console.log("Creating account...");
        e.preventDefault();
        getFormDetails();
    })
    $("#login").submit(function(e){
        console.log("Logging in...");
        e.preventDefault();
        getLoginDetails();
    })
    $("#listCar").submit(function(e){
        console.log("Listing car...");
        e.preventDefault();
        getCarDetails();
    })
})

function getCarDetails(){
    const make = $("#make").val();
    const model = $("#model").val();
    const year = $("#year").val();
    const mileage = $("#mileage").val();
    const type = $("#type").val();
    const color = $("#color").val();
    const price = $("#price").val();
    
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    
    async function Main() {
        const file = document.querySelector('#formFile').files[0];
        console.log(await toBase64(file));
        listCar(make, model, year, mileage, type, color, price, await toBase64(file)).done(function(response){
            if (response.includes("ERROR"))
            {
                $('#createMessage').show();
                $('#createMessage').text(response);
            }
            else
            {
                console.log("Listed!")

                sleep(2000).then(() => goHome());
            }
        });
    } 

    Main();
}

function getFormDetails(){
    const fName = $("#fName").val();
    const lName = $("#lName").val();
    const email = $("#email").val();
    const username = $("#createusername").val();
    const password = $("#createpassword").val();
    const address = $("#address").val();
    const city = $("#city").val();
    const state = $("#state").val();
    const zipcode = $("#zipcode").val();

    createAccount(fName, lName, email, username, password, address, city, state, zipcode).done(function(response){
        if (response.includes("ERROR"))
        {
            $('#createMessage').show();
            $('#createMessage').text(response);
        }
        else
        {
            $('#createAccount').html("Account created! Welcome, "+ fName);
            console.log("USER ID: " + response);
            //expiration for cookie
            const d = new Date();
            d.setTime(d.getTime() + (60*60*1000));
            let expiration = d.toLocaleString();
            // set username cookie
            document.cookie = "username=" + username + "; expires=" + expiration + ";path=/";
            // set full name cookie
            const fullName = fName + " " + lName;
            document.cookie = "fullName=" + fullName + "; expires=" + expiration + ";path=/";
             // set userType cookie
             document.cookie = "userType=C; expires=" + expiration + ";path=/";
             // set user id cookie
             const userID = response;
             document.cookie = "userID=" + userID + "; expires=" + expiration + ";path=/";

            sleep(2000).then(() => goHome());
        }
    });
}

function createAccount(fn, ln, e, u, p, a, c, s, z){
    console.log('createAccount function executing...');
    //use jQuery PLEASE    
    return $.ajax({
        //url: 'https://car-app-demo.herokuapp.com/register',
        url: base + 'register',
        dataType: 'text',
        type: 'POST',
        data: {firstName: fn, lastName: ln, email: e, username: u, password: p, address: a, city: c, state: s, zipcode: z},
        success: function (response, status) {
            console.log('AJAX Success.');
            return response;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('AJAX Request:' + XMLHttpRequest + "\n");
            console.log(XMLHttpRequest.responseText);
            console.log('AJAX Status:' + textStatus + "\n");
            console.log('AJAX Error:' + errorThrown + "\n");
            return "Error " . textStatus;
        }
    });
}

function getLoginDetails(){
    const username = $("#username").val();
    const password = $("#password").val();
    

    login(username, password).done(function(response){
        if (response.includes("ERROR"))
        {
            //show error in html element
            // $('').show();
            // $('').text(response);
        }
        else
        {
            $('#createAccount').html("Account created! Welcome, "+ fName);
            console.log("USER ID: " + response);
            //expiration for cookie
            const d = new Date();
            d.setTime(d.getTime() + (60*60*1000));
            let expiration = d.toLocaleString();
            // set username cookie
            document.cookie = "username=" + username + "; expires=" + expiration + ";path=/";
            // set full name cookie
            const fullName = fName + " " + lName;
            document.cookie = "fullName=" + fullName + "; expires=" + expiration + ";path=/";
             // set userType cookie
             document.cookie = "userType=C; expires=" + expiration + ";path=/";
             // set user id cookie
             const userID = response;
             document.cookie = "userID=" + userID + "; expires=" + expiration + ";path=/";

            sleep(2000).then(() => goHome());
        }
    });
}

function login(u, p){
    console.log('login function executing...');
    //use jQuery PLEASE    
    return $.ajax({
        url: base + 'login',
        dataType: 'text',
        type: 'POST',
        data: {username: u, password: p},
        success: function (response, status) {
            console.log('AJAX Success.\n' + response);
            return response;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('AJAX Request:' + XMLHttpRequest[0] + "\n");
            console.log(XMLHttpRequest.responseText);
            console.log('AJAX Status:' + textStatus + "\n");
            console.log('AJAX Error:' + errorThrown + "\n");
            return "Error " . textStatus;
        }
    });
}

function listCar(make, model, year, mileage, type, color, price, img){
    console.log('createListing function executing...');
    //use jQuery PLEASE
    return $.ajax({
        //url: 'https://car-app-demo.herokuapp.com/register',
        url: base + 'createListing',
        dataType: 'text',
        type: 'POST',
        data: {make: make, model: model, year: year, mileage: mileage, type: type, color: color, price: price, img: img},
        success: function (response, status) {
            console.log('AJAX Success.');
            return response;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('AJAX Request:' + XMLHttpRequest + "\n");
            console.log(XMLHttpRequest.responseText);
            console.log('AJAX Status:' + textStatus + "\n");
            console.log('AJAX Error:' + errorThrown + "\n");
            return "Error " . textStatus;
        }
    });
}

