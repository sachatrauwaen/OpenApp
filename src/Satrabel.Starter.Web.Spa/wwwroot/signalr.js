/*
$(document).ready(function () {
    console.log("ready!");


    var chatHub = null;

    abp.signalr.startConnection('/signalr-myChatHub', function (connection) {
        chatHub = connection; // Save a reference to the hub

        connection.on('getMessage', function (message) { // Register for incoming messages
            console.log('received message: ' + message);
        });
    }).then(function (connection) {
        abp.log.debug('Connected to myChatHub server!');
        abp.event.trigger('myChatHub.connected');
    });

    abp.event.on('myChatHub.connected', function () { // Register for connect event
        chatHub.invoke('sendMessage', "Hi everybody, I'm connected to the chat!"); // Send a message to the server
    });

    

});
*/
abp.event.on('abp.notifications.received', function (userNotification) {
    //abp.notifications.showUiNotifyForUserNotification(userNotification);
    //abp.notifications.showUiNotifyForUserNotification(userNotification);
    //console.log(userNotification);
});