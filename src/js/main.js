import Vue from 'vue';
import '../sass/chatbot.sass';

import { getBotConfig } from './config/config.js';

var widgetMetaData = getBotConfig();


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
        postedOn: '12:30PM'
    },
    {
        isFromServer: true,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '12:30PM'
    },
    {
        isFromServer: false,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '12:30PM'
    },
    {
        isFromServer: true,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '12:30PM'
    },
    {
        isFromServer: true,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '12:30PM'
    },
    {
        isFromServer: false,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '12:30PM'
    },
    {
        isFromServer: false,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '12:30PM'
    },
    {
        isFromServer: false,
        avatarUrl: 'img/avatar/avatar1.png',
        message: 'Sed augue lacus viverra vitae congue eu consequat ac felis. Aliquam vestibulum morbi blandit curs',
        postedOn: '12:30PM'
    }
];

$(document).ready(function () {

    function isPlusMessage(messages, currenteMessage) {
        return messages.length && messages[messages.length - 1].isFromServer === currenteMessage.isFromServer;
    }

    function getTimeFormatted(){
        var dateObj = new Date();

        var hours = dateObj.getHours();
        var minutes = dateObj.getMinutes();

        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;

        return strTime;
    }

    function addMessage(message, isMyMessage) {
        var messages = chatBotView.messages;

        var currentMessage = {
            message: message.message,
            type: message.type,
            options: message.options,
            avatarUrl: 'img/avatar/avatar1.png',
            isFromServer: !isMyMessage,
            postedOn: getTimeFormatted()
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
        methods: {
            postMessage: function postMessage(message) {
                this.$emit('post-message', message);
            }
        },
        template: `
            <div class="chat-bot-container">
                <cb-bot-header v-bind:header-info="metaData"></cb-bot-header>
                <cb-bot-message-list v-bind:messages="messages" v-on:post-message = "postMessage"></cb-bot-message-list>
                <cb-bot-footer v-bind:user-message="userMessage" v-on:post-message = "postMessage"></cb-bot-footer>
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

    Vue.component('cb-bot-footer', {
        props: ['userMessage'],
        methods: {
            emitMessage: function emitMessage() {
                this.$emit('post-message', this.customerMessage)
                this.customerMessage = '';
            }
        },
        data: function () {
            return {
                customerMessage: ''
            }
        },
        template: `
            <div class="cb-footer">
                <form action="javascript:void(0)" class="cb-message-form-box">
                    <input 
                        type = "text" 
                        class = "message-box" 
                        placeholder="Please write your message here" 
                        v-model="customerMessage"
                        v-on:keyup.enter = "emitMessage"
                        />
                </form>
            </div>
        `
    });


    Vue.component('cb-bot-message-list', {
        props: ['messages'],
        methods: {
            postMessage: function postMessage(message) {
                this.$emit('post-message', message)
            }
        },
        template: `
            <div class="cb-body">
                <ul class="cb-message-list">

                <li v-for="message in messages" class="cb-message" :class="{ you: message.isFromServer, me: !message.isFromServer }">
                    <div v-if="message.type === 'OPTION'" >
                        <cb-message-options-list v-bind:message="message" v-on:post-message = "postMessage"></cb-message-options-list>
                    </div>
                    <div v-else >
                        <cb-message-default v-bind:message="message"></cb-message-default>
                    </div>
                </li>

                </ul>
            </div>
        `
    });


    Vue.component('cb-message-default', {
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

    Vue.component('cb-message-options-list', {
        props: ['message'],
        methods: {
            chooseMessage: function chooseMessage(message) {
                this.$emit('post-message', message.title)
            }
        },
        template: `
            <div class="cb-default-message">
                <div class="cb-avatar">
                    <img v-bind:src="message.avatarUrl" alt="">
                </div>

                <div class="cb-message-data">
                    <p class="message-question">
                        {{message.message}}
                    </p>
                    <ul  class="cb-message-options" >
                        <li v-for="option in message.options"  v-on:click = "chooseMessage(option)">
                            <h3 class="message-heading">
                                {{option.title}}
                            </h3>
                            <p class="message-description" v-if="option.description1">
                                {{option.description}}
                            </p>
                        </li>
                    </ul>
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
                    v-bind:user-message="userMessage"
                    v-on:post-message="postMessage">
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
            userMessage: 'Test Message'
        },

        methods: {
            isPlusMessage: function (messages, index) {
                return index && messages[index - 1].isFromServer === messages[index].isFromServer;
            },

            postMessage: function (userMessage) {

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


