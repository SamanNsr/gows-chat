var app = new Vue({
  el: '#app',
  data() {
    return {
      ws: null,
      serverUrl: 'ws://localhost:8080/ws',
      username: '',
      ul: [],
      messages: [],
      newMessage: '',
      statusDiv: '',
    };
  },
  created: function () {
    window.addEventListener(
      'beforeunload',
      function (event) {
        console.log('leaving');
        let jsonData = {};
        jsonData['action'] = 'left';
        WebSocket.send(JSON.stringify(jsonData));
      },
      false
    );
  },
  mounted: function () {
    this.connectToWebsocket();
  },
  methods: {
    connectToWebsocket() {
      this.ws = new ReconnectingWebSocket(this.serverUrl, null, {
        debug: true,
        reconnectInterval: 3000,
      });
      this.ws.addEventListener('open', (event) => {
        this.onWebsocketOpen();
        this.statusDiv = `<span class="badge bg-success">Connected</span>`;
      });
      this.ws.addEventListener('close', (event) => {
        this.onWebsocketClose();
        this.statusDiv = `<span class="badge bg-danger">Not connected</span>`;
      });
      this.ws.addEventListener('error', (event) => {
        this.onWebsocketError(event);
        this.statusDiv = `<span class="badge bg-danger">Not connected</span>`;
      });
      this.ws.addEventListener('message', (event) => {
        this.handleNewMessage(event);
      });
    },
    onWebsocketOpen() {
      console.log('connected to WS!');
    },
    onWebsocketClose() {
      console.log('connection closed');
    },
    onWebsocketError(event) {
      console.log('there was an error');
    },
    handleNewMessage(event) {
      let data = JSON.parse(event.data);

      switch (data.action) {
        case 'list_users':
          this.ul = data.connected_users;
          break;
        case 'broadcast':
          this.messages.push(data.message);
      }
    },
    sendMessage() {
      let jsonData = {};
      if (this.newMessage !== '' && this.username !== '') {
        jsonData['action'] = 'broadcast';
        jsonData['username'] = this.username;
        jsonData['message'] = this.newMessage;
        this.ws.send(JSON.stringify(jsonData));
        this.newMessage = '';
      } else if (this.newMessage === '' && this.username === '') {
        this.errorMessage('Fill out username and message');
      } else if (this.newMessage === '') {
        this.errorMessage('Fill out message');
      } else {
        this.errorMessage('Fill out username');
      }
    },
    userInput() {
      if (this.username !== '') {
        let jsonData = {};
        jsonData['action'] = 'username';
        jsonData['username'] = this.username;
        this.ws.send(JSON.stringify(jsonData));
      } else {
        this.errorMessage('Fill out username');
      }
    },

    errorMessage(msg) {
      notie.alert({
        type: 'error',
        text: msg,
      });
    },
  },
});
