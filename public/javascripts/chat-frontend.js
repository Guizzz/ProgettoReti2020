var username = decodeURIComponent(document.cookie.split('=')[1]);

$(function () {
    "use strict";

    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');
    var invia = $('#send');
    var To = null;
    // my color assigned by the server
    var myColor = false;
    // my name sent to the server
    var myName = username;

    //console.log(username);
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
                                    + 'support WebSockets.'} ));
        input.hide();
        $('span').hide();
        return;
    }

    // open connection
    var connection = new WebSocket('ws://localhost:3000');

    connection.onopen = function () {
        // first we want users to enter their names
        //input.removeAttr('disabled');
        status.text(username);
        connection.send(username);
    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your ' + 'connection or the server is down.' } ));
    };

    // most important part - incoming messages
    connection.onmessage = function (message) 
    {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        try 
        {
            var json = JSON.parse(message.data);
        } 
        catch (e) 
        {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

        if (json.type === 'color') 
        { // first response from the server with user's color
            myColor = json.data;
            status.text(myName + ': ').css('color', myColor);
            //input.removeAttr('disabled').focus();
            // from now user can start sending messages
        } 
        else if (json.type === 'history') 
        { // entire message history
            // insert every single message to the chat window
            for (var i=0; i < json.data.length; i++) 
            {
                addMessage(json.data[i].author, json.data[i].text, json.data[i].color, new Date(json.data[i].time));
            }
        } 
        else if (json.type === 'message') 
        { // it's a single message
            //input.removeAttr('disabled'); // let the user write another message
            addMessage(json.data.author, json.data.text, json.data.color, new Date(json.data.time));
        } 
        else 
        {
            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        }
    };

    /**
     * Send mesage when user presses Enter key
     */
    input.keydown(function(e) 
    {
        if (e.keyCode === 13)
        {
            var msg = 
              {
                  message: $(this).val(),
                  to: invia.val(),
              };

            //var msg = $(this).val();
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            connection.send(JSON.stringify(msg));
            $(this).val('');
            // disable the input field to make the user wait until server
            // sends back response
            //input.attr('disabled', 'disabled');
        }
    });

    /*invia.keydown(function(e) 
    {
        if (e.keyCode === 13)
        {
            To = $(this).val()
            invia.attr('disabled', 'disabled');
            input.removeAttr('disabled');
        }
    });*/

    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function() {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val('Unable to comminucate ' + 'with the WebSocket server.');
        }
    }, 3000);

    /**
     * Add message to the chat window
     */
    function addMessage(author, message, color, dt) {
        content.prepend('<p><span style="color:' + color + '">' + author + '</span> @ ' +
             + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
             + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
             + ': ' + message + '</p>');
    }
});