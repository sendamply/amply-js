const EmailAddress = require('./email_address');

class EmailHelper {
  constructor() {
    this.requestData = {};
  }

  parsedData(data) {
    if (typeof data !== 'object') {
      throw new Error('Expecting object for Email data');
    }

    const {
      from, subject, text, html, content, replyTo, template,
      dynamicTemplateData, unsubscribeGroupUuid, ipOrPoolUuid, attachments,
      headers, categories, clicktracking, substitutions,
      personalizations, to, cc, bcc,
    } = data;

    this.setFrom(from);
    this.setSubject(subject);
    this.setText(text);
    this.setHtml(html);
    this.setContent(content);
    this.setReplyTo(replyTo);
    this.setTemplate(template);
    this.setdynamicTemplateData(dynamicTemplateData);
    this.setUnsubscribeGroupUuid(unsubscribeGroupUuid);
    this.setIpOrPoolUuid(ipOrPoolUuid);
    this.setAttachments(attachments);
    this.setHeaders(headers);
    this.setCategories(categories);
    this.setClicktracking(clicktracking);
    this.setSubstitutions(substitutions);

    if (typeof personalizations !== 'undefined') {
      this.setPersonalizations(personalizations);
    }
    else {
      this.setPersonalizationsFromTo(to, cc, bcc);
    }

    return this.requestData;
  }

  setTo(to) {
    if (typeof to !== 'string' && !Array.isArray(to)) {
      throw new Error('String or array expected for `to`');
    }

    if (typeof to === 'string') {
      this.requestData.personalizations[0].to = [EmailAddress.create(to)];
    }
    else {
      const toArray = [];

      to.forEach((recipient) => {
        toArray.push(EmailAddress.create(recipient));
      });

      this.requestData.personalizations[0].to = toArray;
    }
  }

  setCc(cc) {
    if (typeof cc === 'undefined') {
      return;
    }

    if (typeof cc !== 'string' && !Array.isArray(cc)) {
      throw new Error('String or array expected for `cc`');
    }

    if (typeof cc === 'string') {
      this.requestData.personalizations[0].cc = [EmailAddress.create(cc)];
    }
    else {
      const ccArray = [];

      cc.forEach((recipient) => {
        ccArray.push(EmailAddress.create(recipient));
      });

      this.requestData.personalizations[0].cc = ccArray;
    }
  }

  setBcc(bcc) {
    if (typeof bcc === 'undefined') {
      return;
    }

    if (typeof bcc !== 'string' && !Array.isArray(bcc)) {
      throw new Error('String or array expected for `bcc`');
    }

    if (typeof bcc === 'string') {
      this.requestData.personalizations[0].bcc = [EmailAddress.create(bcc)];
    }
    else {
      const bccArray = [];

      bcc.forEach((recipient) => {
        bccArray.push(EmailAddress.create(recipient));
      });

      this.requestData.personalizations[0].bcc = bccArray;
    }
  }

  setFrom(from) {
    if (typeof from === 'undefined') {
      return;
    }

    this.requestData.from = this.constructor.formatEmails(from)[0];
  }

  setSubject(subject) {
    if (typeof subject !== 'string') {
      throw new Error('String expected for `subject`');
    }

    this.requestData.subject = subject;
  }

  setText(text) {
    if (typeof text === 'undefined') {
      return;
    }

    this.requestData.content = this.requestData.content || [];
    this.requestData.content.push({ type: 'text/plain', value: text });
  }

  setHtml(html) {
    if (typeof html === 'undefined') {
      return;
    }

    this.requestData.content = this.requestData.content || [];
    this.requestData.content.push({ type: 'text/html', value: html });
  }

  setReplyTo(replyTo) {
    if (typeof replyTo === 'undefined') {
      return;
    }

    this.requestData.reply_to = this.constructor.formatEmails(replyTo)[0];
  }

  setContent(content) {
    if (typeof content === 'undefined') {
      return;
    }

    if (!Array.isArray(content)) {
      throw new Error('Array expected for `content`');
    }

    this.requestData.content = this.requestData.content || [];

    content.forEach((contentPart, i) => {
      if (typeof contentPart !== 'object') {
        throw new Error(`Invalid \`content[${i}]\``);
      }

      if (typeof contentPart.type === 'undefined') {
        throw new Error(`\`type\` must be defined for \`content[${i}]\``);
      }

      if (typeof contentPart.value === 'undefined') {
        throw new Error(`\`value\` must be defined for \`content[${i}]\``);
      }

      this.requestData.content.push(contentPart);
    });
  }

  setTemplate(template) {
    if (typeof template === 'undefined') {
      return;
    }

    this.requestData.template = template;
  }

  setdynamicTemplateData(dynamicTemplateData) {
    if (typeof dynamicTemplateData === 'undefined') {
      return;
    }

    if (typeof dynamicTemplateData !== 'object' || Array.isArray(dynamicTemplateData)) {
      throw new Error('Object expected for `dynamicTemplateData`');
    }

    this.requestData.substitutions = this.requestData.substitutions || {};

    Object.entries(dynamicTemplateData).forEach((val) => {
      this.requestData.substitutions[`\$\{${String(val[0])}\}`] = String(val[1]);
    });
  }

  setUnsubscribeGroupUuid(unsubscribeGroupUuid) {
    if (typeof unsubscribeGroupUuid === 'undefined') {
      return;
    }

    this.requestData.unsubscribe_group_uuid = unsubscribeGroupUuid;
  }

  setIpOrPoolUuid(ipOrPoolUuid) {
    if (typeof ipOrPoolUuid === 'undefined') {
      return;
    }

    this.requestData.ip_or_pool_uuid = ipOrPoolUuid;
  }

  setAttachments(attachments) {
    if (typeof attachments === 'undefined') {
      return;
    }

    if (!Array.isArray(attachments)) {
      throw new Error('Array expected for `attachments`');
    }

    const parsedAttachments = [];

    attachments.forEach((attachment, i) => {
      if (typeof attachment.content !== 'string') {
        throw new Error(`\`attachment[${i}][content]\` is required`);
      }

      if (typeof attachment.filename !== 'string') {
        throw new Error(`\`attachment[${i}][filename]\` is required`);
      }

      parsedAttachments.push({
        content: attachment.content,
        filename: attachment.filename,
        type: attachment.type,
        disposition: attachment.disposition,
      });
    });

    this.requestData.attachments = parsedAttachments;
  }

  setHeaders(headers) {
    if (typeof headers === 'undefined') {
      return;
    }

    if (typeof headers !== 'object' || Array.isArray(headers)) {
      throw new Error('Object expected for `headers`');
    }

    this.requestData.headers = this.requestData.headers || {};

    Object.entries(headers).forEach((header) => {
      this.requestData.headers[header[0]] = String(header[1]);
    });
  }

  setCategories(categories) {
    if (typeof categories === 'undefined') {
      return;
    }

    if (!Array.isArray(categories)) {
      throw new Error('Array expected for `categories`');
    }

    this.requestData.analytics = this.requestData.analytics || {};
    this.requestData.analytics.categories = this.requestData.analytics.categories || [];

    categories.forEach((category) => {
      this.requestData.analytics.categories.push(String(category));
    });
  }

  setClicktracking(clicktracking) {
    if (typeof clicktracking === 'undefined') {
      return;
    }

    this.requestData.analytics = this.requestData.analytics || {};
    this.requestData.analytics.clicktracking = !!clicktracking;
  }

  setSubstitutions(substitutions) {
    if (typeof substitutions === 'undefined') {
      return;
    }

    if (typeof substitutions !== 'object' || Array.isArray(substitutions)) {
      throw new Error('Object expected for `substitutions`');
    }

    this.requestData.substitutions = this.requestData.substitutions || {};

    Object.entries(substitutions).forEach((sub) => {
      this.requestData.substitutions[sub[0]] = String(sub[1]);
    });
  }

  setPersonalizations(personalizations) {
    this.requestData.personalizations = personalizations;
  }

  setPersonalizationsFromTo(to, cc, bcc) {
    this.requestData.personalizations = [{}];

    if (
      typeof to === 'undefined'
      && typeof cc === 'undefined'
      && typeof bcc === 'undefined'
    ) {
      throw new Error('Provide at least one of `to`, `cc` or `bcc`');
    }

    if (typeof to !== 'undefined') {
      this.requestData.personalizations[0].to = this.constructor.formatEmails(to);
    }

    if (typeof cc !== 'undefined') {
      this.requestData.personalizations[0].cc = this.constructor.formatEmails(cc);
    }

    if (typeof bcc !== 'undefined') {
      this.requestData.personalizations[0].bcc = this.constructor.formatEmails(bcc);
    }
  }

  static formatEmails(emails) {
    if (Array.isArray(emails)) {
      return emails.map((email) => new EmailAddress(email).toJSON());
    }

    return [new EmailAddress(emails).toJSON()];
  }
}

module.exports = EmailHelper;
