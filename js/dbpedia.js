// Requires: uri - Full URI value
// Effects: Returns resource string from URI
function dbpedia_resource(uri){
    var n = uri.indexOf('resource')+9;
    var resource = uri.substring(n);
    return resource;
}

// Requires: dbpedia Query
// Returns: 
function dbpedia_query(query,property){
	var endpoint = "http://dbpedia.org/sparql"; 
    var queryResult = singleSparqlQueryJson(query, endpoint, false);
    var jsonObj = eval('(' + queryResult + ')');
    console.log(jsonObj);
    if (typeof jsonObj.results.bindings[0] != 'undefined'){
        var result = jsonObj.results.bindings[0][property].value;
        return result;
    }
    else {
        return false;
    }  
};

//Query dbpedia - multiple
// Returns string list of artists delimited by ;
// By default, returns uri values (if return_uri is not set)
// If return_uri is false, returns just artist list
function dbpedia_query_list(query,property){
    var endpoint = "http://dbpedia.org/sparql"; 
    var queryResult = singleSparqlQueryJson(query, endpoint, false);
    var jsonObj = eval('(' + queryResult + ')');
    var result = '';

    // Loop through values
    for(var i = 0; i<  jsonObj.results.bindings.length; i++) {
        //result += " </td></tr>";
        value = jsonObj.results.bindings[i][property].value;
        result += value +'; ';
    }
    return result;
};




//
function dbpedia_query_json(query,property_array){
    var endpoint = "http://dbpedia.org/sparql";
    var queryResult = singleSparqlQueryJson(query, endpoint, false);
    var jsonObj = eval('(' + queryResult + ')');

    var jsonList = [] 
    jsonList.instances = {}
    console.log(jsonObj)
    for(var i = 0; i<  jsonObj.results.bindings.length; i++) {
        jsonList.instances[i] = {}
        for(var j = 0; j <  property_array.length; j++) {
            property = property_array[j];
            prop_value = jsonObj.results.bindings[i][property].value;
            jsonList.instances[i][property] = prop_value
        }

    }
    return jsonList;
}

//
function dbpedia_query_array(query,property){
    var endpoint = "http://dbpedia.org/sparql";
    var queryResult = singleSparqlQueryJson(query, endpoint, false);
    var jsonObj = eval('(' + queryResult + ')');

    var arrayList = [] 
    for(var i = 0; i<  jsonObj.results.bindings.length; i++) {
        prop_value = jsonObj.results.bindings[i][property].value;
        arrayList[i] = prop_value
    }
    return arrayList;
}