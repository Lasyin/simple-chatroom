// IMPORTANT: replace 'SERVER_IP_GOES_HERE' with your server ip address, leave the ws:// and the :9090/ws (that's our port number) and the /ws
var ip = "ws://SERVER_IP_GOES_HERE:9090/ws";

var serverReady = false;
// default username, user can change using username box
var username = "Lasyin";

// this is our websocket between the client and server
var chatSocket = new WebSocket(ip);

// was socket opened?
chatSocket.onopen = function(event){
  serverReady = true;
  console.log("connected to server");
}
// on message received (from server)
chatSocket.onmessage = function(event){
  // parse the json string the was received
  var message = JSON.parse(event.data);
  // spawn the message with the contents and the sender
  spawnMessage(message.msg, message.sender);
}

// Was the send message button clicked?
$("#sendmessage").click(function(){
  // Send the contents of the message box
  sendMessage($("#message").val());
});
// Was the enter key pressed while typing in the message box?
$("#message").keypress(function(e){
  if((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)){
    // Send the contents of the message box
    sendMessage($("#message").val());
  }
});
// Was the submit username button pressed?
$("#submitusername").click(function(){
  // Set username to the contents of the username box
  setUsername($("#username").val());
});
// Was the enter key pressed while typing in the username box?
$("#username").keypress(function(e){
  if((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)){
    // Set username to the contents of the username box
    setUsername($("#username").val());
  }
});

function spawnMessage(str, from){
  // Append a new message to our message display, this is a message that was either sent from another user, or sent by us
  $("#messagedisplay").append('<div class="message"><p class="messagecontent">' + str + '</p><p class="messagesender">' + from + '</p></div>');
}

function sendMessage(str){
  // Are we connected to the server?
  if(serverReady){
    // Make a json string combining the message and sender
    var jsonMsg = JSON.stringify({msg: str, sender: username});
    // Send the json string to our server using our websocket
    chatSocket.send(jsonMsg);
    // Delete the contents of the message box so user doesnt have to
    $("#message").val("");
  } else{
    // If not, let the user know but replacing their message with an error
    $("#message").val("ERROR: SERVER OFFLINE");
  }
}

function setUsername(newname){
  // set our username to the new name
  username = newname;
  // Show the user that their name has changed
  $("#sendingas").text("Logged in as: " + username);
}
