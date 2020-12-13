const EmailHelper = require('./helpers/email');

class EmailClient {
  constructor(request) {
    this.request     = request;
    this.emailHelper = new EmailHelper();
  }

  create(data) {
    const parsedData = this.emailHelper.parsedData(data);
    return this.request.post('/email', parsedData);
  }
}

module.exports = EmailClient;
