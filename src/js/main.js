import Vue from 'vue';
import '../sass/chatbot.sass';

import getBotConfig from './config/config.js';


var widgetMetaData =getBotConfig();


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

    function isPlusMessage(messages, currenteMessage) {
        return messages.length && messages[messages.length - 1].isFromServer === currenteMessage.isFromServer;
    }

    function addMessage(message, isMyMessage) {
        var messages = chatBotView.messages;

        var currentMessage = {
            message: message.message,
            avatarUrl: 'img/avatar/avatar1.png',
            isFromServer: !isMyMessage,
            postedOn: 'DATE'
        };

        currentMessage.isPlusMessage = isPlusMessage(messages, currentMessage);

        messages.push(currentMessage);

        setTimeout(function () {
            $('.cb-body').scrollTop($('.cb-message-list').height());
        }, 1);

    }


    function collapseBot() {
        $('.chat-bot-container').toggleClass('collapsed');
    }

    var botOptions = {
        onReceiveMessage: addMessage,
        onConnectionEstablished: function () { }
    };


    var messageClientObj = new MessageClient(botOptions);

    Vue.component('chat-bot', {
        props: ['metaData', 'messages', 'userMessage'],
        template: `
            <div class="chat-bot-container">
                <cb-bot-header v-bind:header-info="metaData"></cb-bot-header>
                <cb-bot-message-list v-bind:messages="messages"></cb-bot-message-list>
                <cb-bot-footer v-bind:user-message="userMessage"></cb-bot-footer>
            </div>
        `
    });


    Vue.component('cb-bot-header', {
        props: ['headerInfo'],
        template: `
                <div class="cb-header" on-click="@.collapseBot()">
                <h1>{{headerInfo.botHeaderName}}</h1>
                <ul class="cb-header-actions">
                <li>
                    <a href="#" class="close" title>
                    <i class="fas fa-window-minimize"></i>
                    </a>
                </li>
                </ul>
            </div>
        `
    });


    Vue.component('cb-bot-message-list', {
        props: ['messages'],
        template: `
            <div class="cb-body">
                <ul class="cb-message-list">

                <li v-for="message in messages" class="cb-message" :class="{ you: message.isFromServer, me: !message.isFromServer }">
                    <cb-default-message  v-bind:message="message"></cb-default-message>
                </li>

                </ul>
            </div>
        `
    });

    Vue.component('cb-bot-footer', {
        props: ['userMessage'],
        template: `
            <div class="cb-footer">
                <form action="" class="cb-message-form-box">
                    <textarea placeholder="Please write your message here" :value="userMessage"></textarea>
                </form>
            </div>
        `
    });


    Vue.component('cb-default-message', {
        props: ['message'],
        template: `
            <div class="cb-default-message">
                <div class="cb-avatar">
                    <img v-bind:src="message.avatarUrl" alt="">
                </div>

                <div class="cb-message-data">
                    {{message.message}}
                </div>

                <div class="cb-message-date">
                    {{message.postedOn}}
                </div>
            </div>
        `
    });

    chatBotView = new Vue({
        el: '#chatBotPlaceHolder',
        template: `        
            <div id='chatBotTemplate'>
                <chat-bot 
                    v-bind:meta-data="metaData"
                    v-bind:messages="messages" 
                    v-bind:user-message="userMessage">
                </chat-bot>
            </div>
        `,
        data: {
            widgetOptions: {
                isCollapsed: false,
            },
            messages: messageList,
            userInfo: {},
            metaData: widgetMetaData,
            userMessage: ''
        },

        methods: {
            isPlusMessage: function (messages, index) {
                return index && messages[index - 1].isFromServer === messages[index].isFromServer;
            },

            postMessage: function () {
                var userMessage = this.userMessage;

                if (userMessage.trim()) {

                    var messageInfo = {
                        message: userMessage
                    };

                    addMessage(messageInfo, true);
                    messageClientObj.setMessage(messageInfo);
                }
                this.userMessage = '';

            },
            collapseBot: function () {
                this.isCollapsed = !this.isCollapsed;
            }
        }
    });


});


