class EmailAddress {
  constructor(data) {
    if (typeof data === 'string') {
      data = this.constructor.fromString(data);
    }

    if (typeof data !== 'object') {
      throw new Error('Expecting object or string for email address data');
    }

    const { name, email } = data;
    this.setEmail(email);
    this.setName(name);
  }

  static fromString(emailString) {
    if (emailString.indexOf('<') === -1) {
      return { name: undefined, email: emailString };
    }

    let [name, email] = emailString.split('<');

    name  = name.trim();
    email = email.replace('>', '').trim();

    return { name, email };
  }

  setEmail(email) {
    if (typeof email === 'undefined') {
      throw new Error('Must provide `email`');
    }
    if (typeof email !== 'string') {
      throw new Error('String expected for `email`');
    }
    this.email = email;
  }

  setName(name) {
    if (typeof name === 'undefined') {
      return;
    }
    if (typeof name !== 'string') {
      throw new Error('String expected for `name`');
    }
    this.name = name;
  }

  toJSON() {
    const { email, name } = this;
    const json          = { email };

    if (name !== '') {
      json.name = name;
    }

    return json;
  }

  static create(emailData) {
    if (Array.isArray(emailData)) {
      return emailData
        .filter((item) => !!item)
        .map((item) => this.create(item));
    }

    if (emailData instanceof EmailAddress) {
      return emailData;
    }

    return new EmailAddress(emailData);
  }
}

module.exports = EmailAddress;
