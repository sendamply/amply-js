const Request = require('./request');

const EmailClient = require('./email');

class Client {
  constructor() {
    this.clientConfig = { url: 'https://sendamply.com/api/v1', accessToken: '' };

    this.request = new Request(this.clientConfig);
    this.email   = new EmailClient(this.request);
  }

  setAccessToken(token) {
    this.clientConfig.accessToken = token;
  }

  setTimeout(timeout) {
    if (typeof timeout === 'undefined') {
      return;
    }

    this.request.timeout = timeout;
  }
}

module.exports = Client;
