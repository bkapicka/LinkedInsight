// Query for dbpedia Abstract
function dbpedia_abstract(subject){
    var abstract = dbpedia_query('abstract',subject,'en');
    return abstract;
}

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
    console.log(queryResult);
    var jsonObj = eval('(' + queryResult + ')');
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


// Query dbpedia - multiple
// Returns string list of artists delimited by ;
// By default, returns uri values (if return_uri is not set)
// If return_uri is false, returns just artist list
function dbpedia_query_subject_list(subject_type,property,property_prefix,object,return_uri){
    var endpoint = "http://dbpedia.org/sparql"; 
    var object = object.replace(/\ /g,"_"); 
    var query = "PREFIX dbp: <http://dbpedia.org/resource/>"
            + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
            + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
            + "PREFIX dbpprop: <http://dbpedia.org/property/>"
            + "SELECT ?"+subject_type +" WHERE {"
            + " ?" + subject_type  + " " + property_prefix + ":" + property + " dbp:"+ object + " ." 
            + " ?" + subject_type  + " rdf:type dbp2:"+ subject_type + " . }";
    var queryResult = singleSparqlQueryJson(query, endpoint, false);
    var jsonObj = eval('(' + queryResult + ')');
    var result = '';
    console.log(query);
    // Build up a table of results.
    for(var i = 0; i<  jsonObj.results.bindings.length; i++) {
        //result += " </td></tr>";
        value = jsonObj.results.bindings[i][subject_type].value;
        if (return_uri === false){
            var n = value.indexOf('resource')+9;
            value = value.substring(n);
        }
        result += value +'; ';
       
    }
    return result;
};