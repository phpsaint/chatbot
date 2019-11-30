const WebSocket = require('ws');
var port = 8080;

const wss = new WebSocket.Server({ port: port });
console.log('Started on: %s', port);

var responseList = {
    IMAGE: {
      type : 'IMAGES',
      messages: [
        {
          title: 'Group 1',
          imgageUrl: 'img1/food_icons/1.png',
          description: 'Nulla a dignissim lectus. Nam id tellus vel tortor ornare venenatis.'
        },
        {
          title: 'Group 2',
          imgageUrl: 'img1/food_icons/2.png',
          description: 'Nulla a dignissim lectus. Nam id tellus vel tortor ornare venenatis.'
        },
        {
          title: 'Group 3',
          imgageUrl: 'img1/food_icons/3.png',
          description: 'Nulla a dignissim lectus. Nam id tellus vel tortor ornare venenatis.'
        },
        {
          title: 'Group 4',
          imgageUrl: 'img1/food_icons/4.png',
          description: 'Nulla a dignissim lectus. Nam id tellus vel tortor ornare venenatis.'
        }
      ]
    },
    OPTION: {
      type : 'OPTION',
      messages: [
        {
          title: 'OPTION 1',
          description: 'Nulla a dignissim lectus. Nam id tellus vel tortor ornare venenatis.'
        },
        {
          title: 'OPTION 2',
          description: 'Nulla a dignissim lectus. Nam id tellus vel tortor ornare venenatis.'
        },
        {
          title: 'OPTION 3',
          description: 'Nulla a dignissim lectus. Nam id tellus vel tortor ornare venenatis.'
        },
        {
          title: 'OPTION 4',
          description: 'Nulla a dignissim lectus. Nam id tellus vel tortor ornare venenatis.'
        }
      ]
    }
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {

    var useMessage = JSON.parse(message);
    console.log('received: %s', useMessage.message);

    setTimeout(function(){

      var returnMessage = {message : 'Re:' + useMessage.message};
       
      if(message.indexOf('IMAGE') > -1){
        returnMessage =  responseList.IMAGE;
      }
      if(message.indexOf('OPTION') > -1){
        returnMessage =  responseList.OPTION;
      }

      ws.send(JSON.stringify(returnMessage));

    }, 300)
   
  });

  ws.send(JSON.stringify( {message : 'Welcome to Star Bucks'}));
});
