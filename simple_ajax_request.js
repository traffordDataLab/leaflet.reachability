/*
    Created:        2018/07/27 by James Austin - Trafford Data Lab
    Purpose:        Provided as an accompaniment to our leaflet.reachability plugin - provides a simple method to fetch data from an API using a GET request via AJAX and pass the parsed JSON data back via a callback function.
    Dependencies:   None
    Licence:        https://www.trafforddatalab.io/assets/LICENSE.txt
*/
function simpleAjaxRequest(url, callback) {
    if (window.XMLHttpRequest) {
        var xmlhttp = new XMLHttpRequest();

        // Set up the handler to check the status of the request and perform the processing once complete
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // Successful response received so return the parsed JSON
                callback(JSON.parse(xmlhttp.responseText));
            }
            else if (xmlhttp.status >= 300) {
                // Not a successful response, perhaps a 404 etc. so abort
                xmlhttp.abort();
                callback(null);
            }
        };

        // Set up an error handler in case the process fails
        xmlhttp.onerror = function () {
            // Failed to process the request - perhaps CORS issues, i.e. 403, 405 responses etc.
            xmlhttp.abort();
            callback(null);
        };

        try {
            // Open the request - 3rd argument == true to denote an asyncronous request, then send it
            xmlhttp.open('GET', url, true);
            xmlhttp.send();
        }
        catch(e) {
            // Failed to process the request - perhaps bad arguments.
            xmlhttp.abort();
            callback(null);
        }
    }
    else {
        // Browser is not capable of making the request
        callback(null);
    }
}
