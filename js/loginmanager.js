/******************************************************** FB LOGIN *******************************************************/
/***************************************************************************************************************************/

var LoginManager = function() {

	this.allHandlers = new Array();
	
	this.login = function() {
		FB.login(function(response) {
			if (response.authResponse) {
				console.log(response.authResponse);
				this.fetchLikesApi();
			} else {
				console.log("login failed");
			}
		});
	}


    this.successCallBack = function(scopeReference, data) {
        //getUsageData(issueIdString);
        //    plotChart(issueIdString);
        scopeReference.dispatchDataEvent("loggedin", data);
    }

	this.fetchLikesApi = function(callBack) {
		
        var scopeReference = this;
        var facebookId = "undefined";

		console.log('Welcome!  Fetching your information.... ');

		FB.api('/me', function(response) {
			console.log('Good to see you, ' + response.name + '.');
			facebookId = response.id;
			userName = response.name.substring(0, response.name.indexOf(' '));
			console.log(userName);
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
			  var likesMusicList = new Array();
			  for (var i = 0; i < response.data.length; i++) {
				//likesList = likesList + response.data[i].category +":" +  response.data[i].name+ " \n";
				if (response.data[i].category == "Musician/band"){
					likesMusicList.push(response.data[i].name.replace(/[^a-z0-9\s-]/gi, '').trim());
				}
			}

			if (typeof(callBack) == typeof(Function)) {
                callBack(scopeReference, {"id" : facebookId, "list" : likesMusicList});
            }
			
			//name.innerHTML = likesList;
			// crawl through and get id for stuff
			
		});
	}



    ////////////////////////////////////////////////
    // Events listening interface
    //

    
    /**
     * Dispatch a new event to all the event listeners of a given event type
     */
    this.dispatchDataEvent = function(type, details){
        var newEvent = new DataEvent(type, details);

        if (this.allHandlers[type]){
            for (var i in this.allHandlers[type]){
                this.allHandlers[type][i](newEvent);
            }
        }
    }

    /**
     * Add a new event listener for a given event type
     * the parameter 'handler' has to be a function with one parameter which is an event object
     */
    this.addEventListener = function(eventType, handler){
        if (!this.allHandlers[eventType])
            this.allHandlers[eventType] = [];
        this.allHandlers[eventType].push(handler);
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
	loginManager.fetchLikesApi(loginManager.successCallBack);			
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


