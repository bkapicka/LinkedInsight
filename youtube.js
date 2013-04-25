// Takes search string and returns
function youtubeSingleVideo(str) {
	var search = str.replace(/\ /g,"+");
	   // Get our HTTP request object.
    var url = "https://gdata.youtube.com/feeds/api/videos?"
		+ "q="+search
		+ "&orderby=viewCount"
		+ "&max-results=1"
		+ "&alt=json";
    var xmlhttp = null;

    if(window.XMLHttpRequest) {
    	xmlhttp = new XMLHttpRequest();
    }
   	else if(window.ActiveXObject) {
		// Code for older versions of IE, like IE6 and before.
    	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	else {
		alert('Perhaps your browser does not support XMLHttpRequests?');
	}

	// Set up a GET with JSON result format.
	xmlhttp.open('GET', url, false); // GET can have caching probs, so POST
	xmlhttp.send(null);

	if(xmlhttp.status == 200 && xmlhttp.responseText) {	
		var jsonObj = eval('('+xmlhttp.responseText+')');
		if (jsonObj && jsonObj.feed && jsonObj.feed.entry && jsonObj.feed.entry.length > 0) {
			videoURL = jsonObj.feed.entry[0].link[0].href;
			return videoURL;
		}
	}
	else {
		// Some kind of error occurred.
		alert("Error: " + xmlhttp.status + " "
		+ xmlhttp.responseText);
		return false;
	}

	// not found
	return false;
};
