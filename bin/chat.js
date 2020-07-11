var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

// Array with some colors
var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
// ... in random order
colors.sort(function(a,b) { return Math.random() > 0.5; } );

// latest 100 messages
var history = [ ];
// list of currently connected clients (users)
var clients = [ ];

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) 
{
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function findConFromUsr(user)
{
    for (var i = 0; i < clients.length; i++)
    {
        // look for the entry with a matching `code` value
        if (clients[i].usr == user)
        {
            return clients[i].con;
        }
    }

    return -1;
}

function chat(request) 
{
  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

  // accept connection - you should check 'request.origin' to make sure that
  // client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  var connection = request.accept(null, request.origin); 
  // we need to know client index to remove them on 'close' event
  var index = clients.push({con: connection, usr: null}) - 1;
  //console.log(clients[0]);
  var userName = false;
  var userColor = false;

  console.log((new Date()) + ' Connection accepted.');

  

  // user sent some message
  connection.on('message', function(message) 
  {
    console.log(message);
    //console.log(index);
    
    //console.log(connection);
    if (message.type === 'utf8') 
    { // accept only text
        if (userName === false) 
        { // first message sent by user is their name
            // remember user name
            userName = htmlEntities(message.utf8Data);
            clients[index].usr=userName;
            //console.log(clients[index]);
            // get random color and send it back to the user
            userColor = colors.shift();
            connection.sendUTF(JSON.stringify({ type:'color', data: userColor }));
            console.log((new Date()) + ' User is known as: ' + userName + ' with ' + userColor + ' color.');
            
            // send back chat history
			if (history.length > 0) 
			{
			 var myhistory=[];
			 
			 for (var i = 0; i < history.length; i++)
			 {
				 console.log(history[i]);
				// look for the entry with a matching `code` value
				if (history[i].author == userName || history[i].receiver == userName )
				{
					myhistory.push(history[i]);
				}
			 }
			 connection.sendUTF(JSON.stringify( { type: 'history', data: myhistory} ));
			}

        } 
        else 
        { // log and broadcast the message
            var mex = JSON.parse(message.utf8Data);

            console.log((new Date()) + ' Received Message from ' + userName + ' to '+mex.to+' : ' + mex.message);
            toCon = findConFromUsr(mex.to);
            var json,obj;
            if(toCon != -1)
            {
                // we want to keep history of all sent messages
                obj = 
                {
                    time: (new Date()).getTime(),
                    text: htmlEntities(mex.message),
                    author: userName,
                    receiver: mex.to,
                    color: userColor
                };
                history.push(obj);
                history = history.slice(-100);

                json = JSON.stringify({ type:'message', data: obj });

                toCon.sendUTF(json);
            }   
            else
            {
                obj = 
                {
                    time: (new Date()).getTime(),
                    text: htmlEntities("ERROR: USER IS NOT ONLINE"),
                    author: "Server",
                    color: "grey"
                };
                json = JSON.stringify({ type:'message', data: obj });
            }
            
            clients[index].con.sendUTF(json);
        }
    }
  });

  // user disconnected
  connection.on('close', function(con) 
  {
      if (userName !== false && userColor !== false) 
      {
          console.log((new Date()) + " Peer " + clients[index].usr + ' from ' + clients[index].con.remoteAddress + " disconnected.");
          // remove user from the list of connected clients
          clients.splice(index, 1);
          // push back user's color to be reused by another user
          colors.push(userColor);
      }
  });

}
module.exports = chat;
