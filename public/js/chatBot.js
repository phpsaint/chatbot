
/*----------------------- Message Client -----------------------------*/
var defaultSettings = {
    wsUrl: 'ws://127.0.0.1:8080',
    wsProtocol: "protocolOne"
}

function MessageClient(options) {
    this.wsSocket = {};
    this.options = options;
    this.onInit();

}

MessageClient.prototype = {
    onInit: function () {
        this.initializeWebSocket();
    },

    initializeWebSocket: function () {
        var options = this.options;

        this.wsSocket = new WebSocket(defaultSettings.wsUrl, defaultSettings.wsProtocol);

        this.wsSocket.onopen = function (event) {
            if (options.onConnectionEstablished) {
                options.onConnectionEstablished(event);
            }

        };

        this.wsSocket.onmessage = function (event) {
            if (event.data) {
                var message = JSON.parse(event.data);

                if (options.onReceiveMessage) {
                    options.onReceiveMessage(message);
                }
            }

        };
    },

    setMessage: function (message) {
        this.wsSocket.send(JSON.stringify(message));
    },

    onDestroy: function () {
        this.wsSocket.close();
    },
}

/*----------------------- Message Client - End -----------------------------*/

var chatBotView, messageClientObj;

var messageList = [];

var messageList = [
    {
        isFromServer: true,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '06/15/2018 12:30PM'
    },
    {
        isFromServer: true,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '06/15/2018 12:30PM'
    },
    {
        isFromServer: false,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '06/15/2018 12:30PM'
    },
    {
        isFromServer: true,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '06/15/2018 12:30PM'
    },
    {
        isFromServer: true,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '06/15/2018 12:30PM'
    },
    {
        isFromServer: false,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '06/15/2018 12:30PM'
    },
    {
        isFromServer: false,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '06/15/2018 12:30PM'
    },
    {
        isFromServer: false,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '06/15/2018 12:30PM'
    }
];

$(document).ready(function () {

    function addMessage(message, isMyMessage) {
        var messageList = chatBotView.get('messages');

        messageList.push({
            message: message.message,
            avatarUrl: 'img/avatar/avatar1.png',
            isFromServer: !isMyMessage,
            postedOn: 'DATE'
        });

        chatBotView.update();

        $('.cb-body').scrollTop($('.cb-message-list').height())
    }


    function collapseBot() {
        $('.chat-bot-container').toggleClass('collapsed');
    }

    var botOptions = {
        onReceiveMessage: addMessage,
        onConnectionEstablished: function () { }
    };


    var messageClientObj = new MessageClient(botOptions);


    chatBotView = new Ractive({
        target: '#chatBotPlaceHolder',
        template: '#chatBotTemplate',
        data: {
            messages: messageList,
            userInfo: {},

            metaData: {
                botHeaderName: 'StarBucks'
            },
            userMessage: ''
        },

        isPlusMessage: function (messages, index) {
            return index && messages[index - 1].isFromServer === messages[index].isFromServer;
        },

        postMessage: function () {
            var userMessage = this.get('userMessage');

            var messageInfo = {
                message: userMessage
            };

            addMessage(messageInfo, true);

            this.set('userMessage', '');

            messageClientObj.setMessage(messageInfo);
        },
        collapseBot: collapseBot
    });

});


