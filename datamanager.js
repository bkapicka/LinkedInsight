

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

    // TODO: super large size pictures lags system
    // TODO: broken picture links
    // TODO: performance increases
    // TODO: prune and clean up album data so one artist doesn't flood system
    this.fetchSPARQ = function(artistNames) {
        
        var jArrayDates = new Array();
        var minDate;

        console.log("fav artists:" + artistNames);
        
        for ( var i = 0; i <  Math.min(artistNames.length,20); i++) {
            var artistURI = artist_URI(artistNames[i]);
            if (artistURI) {
                var artistStartdate = artist_activeStart(artistURI);
                var potentialPicture = artist_photo(artistURI);
                var potentialAbstract = artist_abstract(artistURI);
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

                var stringAlbumList = artist_album_list(artistURI);
                var albumsList = stringAlbumList.split(';');
                console.log(albumsList);
                for (var j = (albumsList.length - 1); j >= Math.max(0, albumsList.length - 6); j--) {
                    var currentAlbum = albumsList[j].trim();
                    var albumRawDate = album_releaseDate(currentAlbum);
                    var potentialPicture = album_photo(currentAlbum);
                    var potentialAlbumAbstract = album_abstract(currentAlbum);
                    var potentialAlbum = album_displayName(currentAlbum);

                    if (currentAlbum && albumRawDate && potentialPicture && potentialAlbum) {
                        console.log(currentAlbum + " " + albumRawDate.toString());
                        
                        var stringSinglesList = album_single_list(currentAlbum);
                        var singlesList = stringSinglesList.split(';');
                
                        for (var k = 0; k < Math.min(singlesList.length, 4); k++) {
                            var currentSingle = singlesList[k].trim();
                            if (currentSingle && (currentSingle != "")) {
                                var singleRawDate = single_releaseDate(currentSingle);
                                var singleDescription = single_abstract(currentSingle);
                                var singleDisplayName = single_displayName(currentSingle);

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
                                }
                            }
                        }

                        jArrayDates.push({
                            "startDate" : this.getDateFromRawDate(albumRawDate),//album_releaseDate(currentAlbum),
                            "headline" : album_displayName(currentAlbum),
                            "text": potentialAlbumAbstract ? this.getShortDescription(potentialAlbumAbstract) : "",
                            "asset":
                            {
                                "media": potentialPicture ? potentialPicture : "",
                                "credit":"",
                                "caption":""
                            }
                        });
                    }
                }
            }
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

    this.createJson = function(fileName, artistNames, callBack) {

        var scopeReference = this;
        var jsonDataArray = this.fetchSPARQ(artistNames);

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

