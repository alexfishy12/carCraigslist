$(document).ready(function(){
    $("#createAccount").submit(function(e){
        e.preventDefault();
        getFormDetails();
    })
    $("#login").submit(function(e){
        e.preventDefault();
        getLoginDetails();
    })
})

function getFormDetails(){
    const fName = $("#fName").val();
    const lName = $("#lName").val();
    const email = $("#email").val();
    const username = $("#username").val();
    const password = $("#password").val();
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
        url: 'https://car-app-demo.herokuapp.com/register',
        dataType: 'text',
        type: 'POST',
        data: {firstName: fn, lastName: ln, email: e, username: u, password: p, address: a, city: c, state: s, zipcode: z},
        success: function (response, status) {
            console.log('AJAX Success.');
            return response;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('AJAX Request:' + XMLHttpRequest + "\n");
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
        url: 'https://car-app-demo.herokuapp.com/login',
        dataType: 'text',
        type: 'POST',
        data: {username: u, password: p},
        success: function (response, status) {
            console.log('AJAX Success.\n' + response);
            return response;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('AJAX Request:' + XMLHttpRequest[0] + "\n");
            console.log('AJAX Status:' + textStatus + "\n");
            console.log('AJAX Error:' + errorThrown + "\n");
            return "Error " . textStatus;
        }
    });
}

