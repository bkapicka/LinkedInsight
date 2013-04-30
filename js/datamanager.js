

var DataEvent = function(type, data) {
    this.type = type;
    this.data = data;
}

/**
 * Data Analysis holds the data we can show to users regarding bills
 **/
var DataManager = function() {

    this.allHandlers = new Array();
    

    this.createJson = function(fileName, response, callBack) {

        var scopeReference = this;

        $.post('http://sxc2.scripts.mit.edu/linkedinsight/createJson.php', {
            posts:"test post",
            fileName:fileName
        }) 
        .success(function(data) {
            console.log("post success:" + data);
            if (typeof(callBack) == typeof(Function)) {
                callBack(scopeReference, data);
            }
        })
        .fail(function(data) {
            console.log("post fail:" + data);
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

