/******************************************************** FB LOGIN *******************************************************/
/***************************************************************************************************************************/

var LoginManager = function() {

	this.login = function() {
	FB.login(function(response) {
			if (response.authResponse) {
				// connected
				testAPI();
			} else {
				// cancelled
			}
		});
	}


    this.successCallBack = function(scopeReference, data) {
        //getUsageData(issueIdString);
        //    plotChart(issueIdString);
        scopeReference.dispatchDataEvent("loggedin", data);
    }

	this.testAPI = function(callBack) {
		
        var scopeReference = this;

		console.log('Welcome!  Fetching your information.... ');

		FB.api('/me', function(response) {
			console.log('Good to see you, ' + response.name + '.');
			// var image = document.getElementById('image');
			//   image.src = 'https://graph.facebook.com/' + response.id + '/picture';
			// var name = document.getElementById('name');
			//   name.innerHTML = response.name;
			// var name = document.getElementById('hometown');
			//   name.innerHTML = response.hometown.name;
		});
		FB.api('/me/friends', function(response) {
			// var name = document.getElementById('friends');
			//   var friendslist;
			//   for (var i = 0; i < response.data.length; i++) {
			// 	friendslist = friendslist + response.data[i].name + "\n";
			//   }
			//   name.innerHTML = friendslist;
			  
		});
		FB.api('/me/likes', function(response) {
			  console.log("RESSPONSE"+response);
			  var likesList;
			  for (var i = 0; i < response.data.length; i++) {
				likesList = likesList + response.data[i].category +":" +  response.data[i].name+ " \n";
				if (response.data[i].category == "Musician/band"){
					console.log(response.data[i].category + " " + response.data[i].name);
					var artistURI = artist_URI(response.data[i].name);
					console.log(artistURI);
					console.log(artist_displayName(artistURI));
					console.log(artist_abstract(artistURI));
					console.log(artist_activeStart(artistURI));
					console.log(artist_photo(artistURI));
					console.log(artist_single_list(artistURI));
					console.log(artist_album_list(artistURI));
				}
			}

			if (typeof(callBack) == typeof(Function)) {
                callBack(scopeReference, response);
            }
			
			//name.innerHTML = likesList;
			// crawl through and get id for stuff
			
		});
	}	  

}


var loginManager = new LoginManager();

window.fbAsyncInit = function() {
  FB.init({
    appId      : '153506961485121', // App ID
    channelUrl : '../channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
  FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
	console.log("connected");
	loginManager.testAPI(loginManager.successCallBack);			
  } else if (response.status === 'not_authorized') {
	console.log("not authorized");
	loginManager.login();
  } else {
	console.log("not logged in");
	loginManager.login();
  }
 });
};

// Load the SDK Asynchronously
(function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
 }(document));


