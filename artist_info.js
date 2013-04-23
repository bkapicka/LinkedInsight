// *********
// Artists
// *********

/* 
Faster: remove prefixes given dbpedia (except for dbp/dbp2 - replace w/ sparql prefixs for dbpedia

//Data issues:
Start and End year sometime the same
Depiction - if it doesn't exist, may be worth to check for flickr stream and pull first photo in new function

**** Example dual song/single query
PREFIX dbp: <http://dbpedia.org/resource/>PREFIX dbp2: <http://dbpedia.org/ontology/>PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?abstract WHERE { 

<http://dbpedia.org/resource/Charlie_(song)> dbp2:abstract ?abstract . FILTER langMatches(lang(?abstract), 'en') . 

# Songs
{
<http://dbpedia.org/resource/Charlie_(song)> rdf:type dbp2:Song
}
UNION
# and Singles
{
<http://dbpedia.org/resource/Charlie_(song)> rdf:type dbp2:Single
}
} 



*/

// Input: Artist name (from facebook)
// Return: Artist URI

function replace_space(str){
	var updated_str = str.replace(/\ /g,"_");  
	return updated_str;
}

//
function artist_URI(artist){
	var query 	= "PREFIX dbp: <http://dbpedia.org/resource/>"
            	+ "PREFIX dbp2: <http://dbpedia.org/ontology/>"
            	+ "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
            	+ "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
            	+ "SELECT ?uri WHERE {"
                + "{{?uri rdf:type dbp2:Band} UNION {?uri rdf:type dbp2:Artist}} ."
            	+ "{{?uri rdfs:label '" + artist + "'@en }"
            	+ "UNION {?uri rdfs:label '" + artist + " (band)'@en }"
                + "UNION {?uri rdfs:label '" + artist + " (Band)'@en }}}";
	var artist_URI = dbpedia_query(query,'uri');
    return artist_URI;
};

// Input: artist URI
// Output: Artist Display Name
function artist_displayName(artist_uri){
    var query 	= "PREFIX dbp: <http://dbpedia.org/resource/>"
            	+ "PREFIX dbpprop: <http://dbpedia.org/property/>"
            	+ "SELECT ?name WHERE "
            	+ "{ <" + artist_uri + "> dbpprop:name ?name}";
    var displayName = dbpedia_query(query,'name');
    return displayName;
}

// Returns wikipedia abstract as string (source is dbpedia)
function artist_abstract(artist_uri) {
    var query 	= "PREFIX dbp: <http://dbpedia.org/resource/>"
            	+ "PREFIX dbp2: <http://dbpedia.org/ontology/>"
            	+ "SELECT ?abstract WHERE "
            	+ "{ <" + artist_uri + "> dbp2:abstract ?abstract"
            	+ " . FILTER langMatches(lang(?abstract), 'en')}";	
    var abstract = dbpedia_query(query,'abstract');
    return abstract;
};

// Returns artist start date
function artist_activeStart(artist_uri){
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "SELECT ?activeStart WHERE "
                +"{ <" + artist_uri + "> dbp2:activeYearsStartYear ?activeStart }";
    var activeStart = dbpedia_query(query,'activeStart');
	return activeStart;

};

// Returns artist start date
function artist_activeEnd(artist_uri){
	var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "SELECT ?activeEnd WHERE "
                +"{ <" + artist_uri + "> dbp2:activeYearsEndYear ?activeEnd }";
    var activeEnd = dbpedia_query(query,'activeEnd');
	return activeEnd;
};

//Returns photo location from depiction field in dbpedia (note - most use outdated photo)
//no need to replace common (generally not localized)
function artist_photo(artist_uri) {
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "PREFIX  foaf: <http://xmlns.com/foaf/0.1/>"
                + "SELECT ?depiction WHERE {"
                + " <" + artist_uri + "> foaf:depiction ?depiction}";
    var photo = dbpedia_query(query,'depiction');
    return photo;
};

// Returns delimited string of artists
function artist_related_list(artist_uri){
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "SELECT ?associatedBand WHERE { "
                + "<" + artist_uri + "> dbp2:associatedBand ?associatedBand}";
    var artistList = dbpedia_query_list(query,'associatedBand');
    return artistList;
}

// Returns delimited string of albums
function artist_album_list(artist_uri){
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "PREFIX dbpprop: <http://dbpedia.org/property/>"
                + "SELECT ?album WHERE {"
                + " ?album dbp2:artist <" + artist_uri + "> ." 
                + "{ ?album rdf:type dbp2:Album}"
                + "UNION" 
                + "{ ?album rdf:type dbp2:album}"
                + "  }";
    var artistList = dbpedia_query_list(query,'album');
    return artistList;
}

// Returns delimited string of albums
function artist_single_list(artist_uri){
    var query = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "PREFIX dbpprop: <http://dbpedia.org/property/>"
                + "SELECT ?single WHERE {"
                + " ?single dbp2:musicalArtist <" + artist_uri + "> ." 
                + " ?single rdf:type dbp2:Single }";
    var singleList = dbpedia_query_list(query,'single');
    return singleList;
}


// *********
// Albums
// *********

function album_displayName(album_uri){
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbpprop: <http://dbpedia.org/property/>"
                + "SELECT ?name WHERE "
                + "{ <" + album_uri + "> dbpprop:name ?name}";
    var displayName = dbpedia_query(query,'name');
    return displayName;
}

// Returns album artist
function album_artist(album_uri) {
    var query   = "PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>"
                + "SELECT ?artist WHERE "
                + "{ <" + album_uri + "> dbpedia-owl:artist ?artist}";
    var artist = dbpedia_query(query,'artist');
    return artist;
};

//Returns photo location from depiction field in dbpedia (note - most use outdated photo)
//dbpedia - depiciton of - replace "commons" with location data in url
function album_photo(album_uri) {
    query = "PREFIX  foaf: <http://xmlns.com/foaf/0.1/>"
            + "SELECT ?depiction WHERE {"
            + " <" + album_uri + "> foaf:depiction ?depiction}";
    var photo = dbpedia_query(query,'depiction');
    
    //Replace album photo w/ 'en'
    photo = photo.replace('commons','en');
    
    return photo;
};

// Returns wikipedia abstract as string (source is dbpedia)
function album_abstract(album_uri) {
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "SELECT ?abstract WHERE "
                + "{ <" + album_uri + "> dbp2:abstract ?abstract"
                + " . FILTER langMatches(lang(?abstract), 'en')}";  
    var abstract = dbpedia_query(query,'abstract');
    return abstract;
};

// Returns album start date
function album_releaseDate(album_uri){
	var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "SELECT ?releaseDate WHERE "
                +"{ <" + album_uri + "> dbp2:releaseDate ?releaseDate }";
    var releaseDate = dbpedia_query(query,'releaseDate');
	return releaseDate;
};

// Returns delimited string of albums
function album_single_list(album_uri){
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "PREFIX dbpprop: <http://dbpedia.org/property/>"
                + "SELECT ?single WHERE {"
                + " ?single dbpprop:fromAlbum <" + album_uri + "> ." 
                + " ?single rdf:type dbp2:Single }";
    var singleList = dbpedia_query_list(query,'single');
    return singleList;
};


// *********
// Singles
// *********
function single_displayName(single_uri){
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbpprop: <http://dbpedia.org/property/>"
                + "SELECT ?name WHERE "
                + "{ <" + single_uri + "> dbpprop:name ?name}";
    var displayName = dbpedia_query(query,'name');
    return displayName;
}

function single_abstract(single_uri){
	var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "SELECT ?abstract WHERE "
                + "{ <" + single_uri + "> dbp2:abstract ?abstract"
                + " . FILTER langMatches(lang(?abstract), 'en')}";  
    var abstract = dbpedia_query(query,'abstract');
    return abstract;
}

function single_releaseData(single_uri){
// Returns artist start date
	activeStart = dbpedia_query('releaseDate',single,'Song',true);
	return activeStart;
};