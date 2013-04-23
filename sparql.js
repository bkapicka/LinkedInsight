// Modified verson of:  http://semapps.blogspot.com/2012/05/sparql-query-from-javascript.html
function singleSparqlQueryJson(queryStr, endpoint, isDebug) {
	var querypart = "query=" + escape(queryStr);

  	// Get our HTTP request object.
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

	 // Set up a POST with JSON result format.
	 xmlhttp.open('POST', endpoint, false); // GET can have caching probs, so POST
	 xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	 xmlhttp.setRequestHeader("Accept", "application/sparql-results+json");

	 // Send the query to the endpoint.
	xmlhttp.send(querypart);
	
	if(xmlhttp.status == 200) {
	   
		if(isDebug) alert(xmlhttp.responseText);
		// Return results
		return xmlhttp.responseText;
	} 
	else {
		// Some kind of error occurred.
		alert("Sparql query error: " + xmlhttp.status + " "
		+ xmlhttp.responseText);
	}
};