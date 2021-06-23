const EmailHelper = require('./helpers/email');

class EmailClient {
  constructor(request) {
    this.request = request;
  }

  create(data) {
    const parsedData = new EmailHelper().parsedData(data);
    return this.request.post('/email', parsedData);
  }
}

module.exports = EmailClient;
