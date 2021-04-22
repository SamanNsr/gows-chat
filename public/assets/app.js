var app = new Vue({
  el: '#app',
  data: {
    ws: null,
    serverUrl: 'ws://localhost:8080/ws',
    messages: [],
    newMessage: '',
  },
  mounted: function () {
    this.connectToWebsocket();
  },
  methods: {
    connectToWebsocket() {
      this.ws = new WebSocket(this.serverUrl);
      this.ws.addEventListener('open', (event) => {
        this.onWebsocketOpen();
      });
      this.ws.addEventListener('close', (event) => {
        this.onWebsocketClose();
      });
      this.ws.addEventListener('error', (event) => {
        this.onWebsocketError(event);
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
      let data = event.data;
      console.log(data);
      data = data.split(/\r?\n/);

      for (let i = 0; i < data.length; i++) {
        let msg = JSON.parse(data[i]);
        this.messages.push(msg);
      }
    },
    sendMessage() {
      if (this.newMessage !== '') {
        this.ws.send(JSON.stringify({ message: this.newMessage }));
        this.newMessage = '';
      }
    },
  },
});
