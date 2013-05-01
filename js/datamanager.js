var MAXARTISTS = 8;
var MAXALBUMSPER = 5;
var MAXSINGLESPER = 2;



var DataEvent = function(type, data) {
    this.type = type;
    this.data = data;
}

/**
 * Data Analysis holds the data we can show to users regarding bills
 **/
var DataManager = function() {

    this.allHandlers = new Array();
    
    this.getShortDescription = function(description) {
        // two sentences
        return description.substring(0, description.indexOf(". ", description.indexOf(". ")+2)+1);
    }

    //2002-07-09 
    this.getDateFromRawDate = function(stringDate) {
        // var year = parseInt(stringDate.substring(0, 4));
        // var month = parseInt(stringDate.substring(5, 2));
        // var day = parseInt(stringDate.substring(7, 2));

        // return new Date(year, month, day, 0, 0, 0, 0);
        return stringDate.replace('-',',');
    }

    this.returnFormattedURI = function(artistURI, location) {
        return "<a href = '" + artistURI +"' target='_blank'>"+location+"</a>";
    }

    this.insertDefaultArtist = function() {
        var defaultEntry = {
                    //"2004,1,10" why not bone thugs n harmony
                    "startDate" : "2004,1,10",
                    "headline" : "DefaultArtist",
                    "text": "example of a default artist description",
                    "asset":
                    {
                        "media": "",
                        "credit":"",
                        "caption":""
                    }
                };

        return defaultEntry;
    }

    // TODO: super large size pictures lags system
    // TODO: broken picture links
    // TODO: performance increases
    // TODO: prune and clean up album data so one artist doesn't flood system
    this.fetchSPARQ = function(artistNames, userName) {
        
        var jArrayDates = new Array();
        var minDate;

        console.log("fav artists:" + artistNames);
        var i = 0, iArtist = 0;
        while ((iArtist < MAXARTISTS) && (i < artistNames.length)) {
       // for ( var i = 0; i <  Math.min(artistNames.length,20); i++) {
            var artistURI = artist_URI(artistNames[i]);
            if (artistURI) {
                var artistStartdate = artist_activeStart(artistURI);
                var potentialPicture = artist_photo(artistURI);
                var potentialAbstract = artist_abstract(artistURI);
                //console.log(this.getShortDescription(potentialAbstract) + this.returnFormattedURI(artistURI));
                var sameAsURI = artist_sameAsUri(artistURI);

                var exploreText = "<br><i>Explore this linked object:</i><br>" + this.returnFormattedURI(artistURI, "DBPedia");
                if (sameAsURI.indexOf('nytimes.com') >= 0) {
                    exploreText = exploreText + " : " +this.returnFormattedURI(sameAsURI, "New York Times");
                }

                jArrayDates.push({
                    //"2004,1,10" why not bone thugs n harmony
                    "startDate" : artistStartdate,
                    "headline" : artistNames[i],
                    "text": potentialAbstract? this.getShortDescription(potentialAbstract) + exploreText: "",
                    "asset":
                    {
                        "media": potentialPicture ? potentialPicture : "",
                        "credit":"",
                        "caption":""
                    }
                });
                iArtist++;
                var stringAlbumList = artist_album_list(artistURI);
                var albumsList = stringAlbumList.split(';');
                console.log(albumsList);
                //for (var j = (albumsList.length - 1); j >= Math.max(0, albumsList.length - 6); j--) {

                var j = 0, jArtist = 0;

                while ((jArtist < MAXALBUMSPER) && (j < albumsList.length)) {
      
                //for (var j = 0; j < Math.min(8, albumsList.length); j++) {
                    var currentAlbum = albumsList[j].trim();
                    var albumRawDate = album_releaseDate(currentAlbum);
                    var potentialPicture = album_photo(currentAlbum);
                    var potentialAlbumAbstract = album_abstract(currentAlbum);
                    var potentialAlbum = album_displayName(currentAlbum);
                    var singleAlbum = false;
        
                    if (currentAlbum && albumRawDate && potentialPicture && potentialAlbum) {
                        console.log(currentAlbum + " " + albumRawDate.toString());
                        
                        var stringSinglesList = album_single_list(currentAlbum);
                        var singlesList = stringSinglesList.split(';');
                
                        var k = 0, kArtist = 0;
                        while ((kArtist < MAXSINGLESPER) && (k < singlesList.length)) {
                        //for (var k = 0; k < Math.min(singlesList.length, 4); k++) {
                            var currentSingle = singlesList[k].trim();
                            if (currentSingle && (currentSingle != "")) {
                                singleAlbum = true;
                                var singleRawDate = albumRawDate;
                                var singleDescription = single_abstract(currentSingle);
                                var singleDisplayName = single_displayName(currentSingle);

                                console.log("Begin youtube search for:" + singleDisplayName);
                                var haveVideo = youtubeSingleVideo(singleDisplayName + " " + artistNames[i] + " official music video");
                                console.log("Youtube search string:" + singleDisplayName + " " + artistNames[i] + " official music video");
                                if (haveVideo && singleRawDate && singleDisplayName && singleDescription) {
                                    jArrayDates.push({
                                        "startDate" : this.getDateFromRawDate(singleRawDate),//album_releaseDate(currentAlbum),
                                        "headline" : singleDisplayName,
                                        "text": singleDescription ? this.getShortDescription(singleDescription) : "",
                                        "asset":
                                        {
                                            "media": haveVideo ? haveVideo : "",
                                            "credit":"",
                                            "caption":""
                                        }
                                    });

                                    kArtist++;
                                }
                            }

                            k++;
                        }

                        jArrayDates.push({
                            "startDate" : this.getDateFromRawDate(albumRawDate),//album_releaseDate(currentAlbum),
                            "headline" : potentialAlbum,
                            "text": potentialAlbumAbstract ? this.getShortDescription(potentialAlbumAbstract) : "",
                            "asset":
                            {
                                "media": potentialPicture ? potentialPicture : "",
                                "credit":"",
                                "caption":""
                            }
                        });

                        if (singleAlbum) {
                            jArtist++;
                        }
                    }

                    j++;
                }
                
            }
            i++;
            //console.log(artist_displayName(artistURI));
                        // console.log(artist_abstract(artistURI));
                        // console.log(artist_activeStart(artistURI));
                        // console.log(artist_photo(artistURI));
                        // console.log(artist_single_list(artistURI));
            // console.log(artist_album_list(artistURI));

            // need to encode in json
        }

        if (iArtist == 0) {
            jArrayDates.push(this.insertDefaultArtist());
        }
        var jsonTimelineAttributes  = {
            "headline":"Music Timeline of " + userName,
            "type":"default",
            "text":"A personalized visual experience of audio through time",
        //    "startDate":minDate,
            "date":jArrayDates
        }

        var jsonTimeline = {
            "timeline": jsonTimelineAttributes
        };

        return jsonTimeline;
    } 

    this.fetchSPARQL2 = function(artistNames) {
        
        var jArrayDates = new Array();
        var minDate;

        console.log("fav artists:" + artistNames);

        var artistsURI = new Array();
        artistsURI = artist_list_URI(artistNames)

        var artistsInfo = new Array();
        artistsInfo = artists_info()

        var i = 0, iArtist = 0;
        while ((iArtist < MAXARTISTS) && (i < artistNames.length)) {
       // for ( var i = 0; i <  Math.min(artistNames.length,20); i++) {
            var artistURI = artist_URI(artistNames[i]);
            if (artistURI) {
                var artistStartdate = artistsInfo[i][activeStart];
                var potentialPicture = artistsInfo[i][depiction];
                var potentialAbstract = artistsInfo[i][abstract];
                console.log(artistURI);
                jArrayDates.push({
                    //"2004,1,10" why not bone thugs n harmony
                    "startDate" : artistStartdate,
                    "headline" : artistNames[i],
                    "text": potentialAbstract? this.getShortDescription(potentialAbstract) : "",
                    "asset":
                    {
                        "media": potentialPicture ? potentialPicture : "",
                        "credit":"",
                        "caption":""
                    }
                });
                iArtist++;
                var stringAlbumList = artist_album_list(artistURI);
                var albumsList = stringAlbumList.split(';');
                console.log(albumsList);
                //for (var j = (albumsList.length - 1); j >= Math.max(0, albumsList.length - 6); j--) {

                var j = 0, jArtist = 0;

                while ((jArtist < MAXALBUMSPER) && (j < albumsList.length)) {
      
                //for (var j = 0; j < Math.min(8, albumsList.length); j++) {
                    var currentAlbum = albumsList[j].trim();
                    var albumRawDate = album_releaseDate(currentAlbum);
                    var potentialPicture = album_photo(currentAlbum);
                    var potentialAlbumAbstract = album_abstract(currentAlbum);
                    var potentialAlbum = album_displayName(currentAlbum);
                    var singleAlbum = false;
        
                    if (currentAlbum && albumRawDate && potentialPicture && potentialAlbum) {
                        console.log(currentAlbum + " " + albumRawDate.toString());
                        
                        var stringSinglesList = album_single_list(currentAlbum);
                        var singlesList = stringSinglesList.split(';');
                
                        var k = 0, kArtist = 0;
                        while ((kArtist < MAXSINGLESPER) && (k < singlesList.length)) {
                        //for (var k = 0; k < Math.min(singlesList.length, 4); k++) {
                            var currentSingle = singlesList[k].trim();
                            if (currentSingle && (currentSingle != "")) {
                                singleAlbum = true;
                                var singleRawDate = albumRawDate;
                                var singleDescription = single_abstract(currentSingle);
                                var singleDisplayName = single_displayName(currentSingle);

                                console.log("Begin youtube search for:" + singleDisplayName);
                                var haveVideo = youtubeSingleVideo(singleDisplayName + " " + artistNames[i] + " official music video");
                                console.log("Youtube search string:" + singleDisplayName + " " + artistNames[i] + " official music video");
                                if (haveVideo && singleRawDate && singleDisplayName && singleDescription) {
                                    jArrayDates.push({
                                        "startDate" : this.getDateFromRawDate(singleRawDate),//album_releaseDate(currentAlbum),
                                        "headline" : singleDisplayName,
                                        "text": singleDescription ? this.getShortDescription(singleDescription) : "",
                                        "asset":
                                        {
                                            "media": haveVideo ? haveVideo : "",
                                            "credit":"",
                                            "caption":""
                                        }
                                    });

                                    kArtist++;
                                }
                            }

                            k++;
                        }

                        jArrayDates.push({
                            "startDate" : this.getDateFromRawDate(albumRawDate),//album_releaseDate(currentAlbum),
                            "headline" : potentialAlbum,
                            "text": potentialAlbumAbstract ? this.getShortDescription(potentialAlbumAbstract) : "",
                            "asset":
                            {
                                "media": potentialPicture ? potentialPicture : "",
                                "credit":"",
                                "caption":""
                            }
                        });
                        
                        if (singleAlbum) {
                            jArtist++;
                        }
                    }

                    j++;
                }
                
            }
            i++;
            //console.log(artist_displayName(artistURI));
                        // console.log(artist_abstract(artistURI));
                        // console.log(artist_activeStart(artistURI));
                        // console.log(artist_photo(artistURI));
                        // console.log(artist_single_list(artistURI));
            // console.log(artist_album_list(artistURI));

            // need to encode in json
        }

        var jsonTimelineAttributes  = {
            "headline":"My Music Timeline [Name]",
            "type":"default",
            "text":"A visual chronological experience of audio",
        //    "startDate":minDate,
            "date":jArrayDates
        }

        var jsonTimeline = {
            "timeline": jsonTimelineAttributes
        };

        return jsonTimeline;
    }  

    // fileName: <facebookid>.rdf
    // rdfString: string representation of entire RDF file
    // callBack: successcallback method, use successRDFCallBack
    // 
    // This function calls the scripts server to create a rdf file in the musicfoafiles subfolder
    //   web.mit.edu/sxc2/www/linkedinsight/musicfoafiles/
    // The remote php file will return a success or failure code
    // 
    // Example usage:
    //   dataManager.createRDF("1234565.rdf", "<testrdf/>", dataManager.successRDFCallBack);
    this.createRDF = function(fileName, rdfString, callBack) {

        var scopeReference = this;
        
        $.post('http://sxc2.scripts.mit.edu/linkedinsight/createRDF.php', {
            posts:rdfString,
            fileName:fileName
        }) 
        .success(function(data) {
            console.log("post create rdf success:" + fileName + " with: " + data);
            if (typeof(callBack) == typeof(Function)) {
                callBack(scopeReference, data);
            }
        })
        .fail(function(data) {
            console.log("post create rdf fail:" + fileName + " with: " + data);
        });

    }

    this.createJson = function(fileName, artistNames, callBack, userName) {

        var scopeReference = this;
        var jsonDataArray = this.fetchSPARQL2(artistNames, userName);

        $.post('http://sxc2.scripts.mit.edu/linkedinsight/createJson.php', {
            posts:jsonDataArray,
            fileName:fileName
        }) 
        .success(function(data) {
            console.log("post create json success:" + data);
            if (typeof(callBack) == typeof(Function)) {
                callBack(scopeReference, jsonDataArray);
            }
        })
        .fail(function(data) {
            console.log("post create json fail:" + data);
        });

    }

    this.successCallBack = function(scopeReference, data) {
        //getUsageData(issueIdString);
        //    plotChart(issueIdString);
        scopeReference.dispatchDataEvent("dataloaded", data);
    }

    this.successRDFCallBack = function(scopeReference, data) {
        //getUsageData(issueIdString);
        //    plotChart(issueIdString);
        scopeReference.dispatchDataEvent("rdfCreated", data);
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

