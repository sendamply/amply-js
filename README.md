# Amply.js

This is the Amply Javascript SDK that integrates with the [v1 API](https://docs.sendamply.com/docs/api/docs/Introduction.md).

__Table of Contents__

- [Install](#install)
- [Quick Start](#quick-start)
- [Methods](#methods)
	- [email](#email)

## Install

### Prerequisites
- Node.js
- Amply account, [sign up here.](https://sendamply.com/plans)

### Access Token

Obtain your access token from the [Amply UI.](https://sendamply.com/home/settings/access_tokens)

### Install Package
```
npm install amply.js
```

### Domain Verification
Add domains you want to send `from` via the [Verified Domains](https://sendamply.com/home/settings/verified_domains) tab on your dashboard.

Any emails you attempt to send from an unverified domain will be rejected.  Once verified, Amply immediately starts warming up your domain and IP reputation.  This warmup process will take approximately one week before maximal deliverability has been reached.

## Quick Start
The following is the minimum needed code to send a simple email. Use this example, and modify the `to` and `from` variables:

```js
const amply = require ('amply.js');
amply.setAccessToken(process.env.AMPLY_ACCESS_TOKEN);

//ES6
amply.email.create({
  to: 'test@example.com',
  from: 'test@verifieddomain.com',
  subject: 'My first Amply email!',
  text: 'This is easy',
  html: '<strong>and fun :)</strong>'
}).then(msg => console.log(msg))
.catch(err => console.log(err.response));
```

Once you execute this code, you should have an email in the inbox of the recipient.  You can check the status of your email in the UI from the [Search](https://sendamply.com/home/analytics/searches/basic/new), [SQL](https://sendamply.com/home/analytics/searches/sql/new), or [Users](https://sendamply.com/home/analytics/users) page.

## Methods

### email

Parameter(s)         | Description
:---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
to, cc, bcc | Email address of the recipient(s).  This may be a string `Test <test@example.com>`, an object `{name: 'Test', email: 'test@example.com'}`, or an array of strings and objects.
personalizations | For fine tuned access, you may override the to, cc, and bcc keys and use advanced personalizations.  See the API guide [here](https://docs.sendamply.com/docs/api/Mail-Send.v1.yaml/paths/~1email/post).
from | Email address of the sender.  This may be formatted as a string or object.  An array of senders is not allowed.
subject | Subject of the message.
html | HTML portion of the message.
text | Text portion of the message.
content | An array of objects containing the following keys: `type` (required), `value` (required).
template | The template to use. This may be a string (the UUID of the template), an array of UUID's (useful for A/B/... testing where one is randomly selected), or an object of the format `{template1Uuid: 0.25, template2Uuid: 0.75}` (useful for weighted A/B/... testing).
dynamicTemplateData | The dynamic data to be replaced in your template.  This is an object of the format `{variable1: 'replacement1', ...}`. Variables should be defined in your template body using handlebars syntax `{{variable1}}`.
replyTo |Email address of who should receive replies.  This may be a string or an object with `name` and `email` keys.
headers | An object where the header name is the key and header value is the value.
ipOrPoolUuid | The UUID of the IP address or IP pool you want to send from.  Default is your Global pool.
unsubscribeGroupUuid | The UUID of the unsubscribe group you want to associate with this email.
attachments[][content] | A base64 encoded string of your attachment's content.
attachments[][type] | The MIME type of your attachment.
attachments[][filename] | The filename of your attachment.
attachments[][disposition] | The disposition of your attachment (`inline` or `attachment`).
attachments[][content_id] | The content ID of your attachment.
clicktracking | Enable or disable clicktracking.
opentracking | Enable or disable opentracking.
categories | An array of email categories you can associate with your message.
substitutions | An object of the format `{subFrom: 'subTo', ...}` of substitutions.
sendAt | Delay sending until a specified time. An ISO8601 formatted string with timezone information.

__Example__

```js
amply.email.create({
  to:   'example@test.com',
  from: 'From <example@verifieddomain.com>',
  text: 'Text part',
  html: 'HTML part',
  personalizations: [{to: [{name: 'Override To', email: 'test@example.com'}]}],
  content: [{type: 'text/testing', value: 'some custom content type'}],
  subject: 'A new email!',
  replyTo: 'Reply To <test@example.com>',
  template: 'faecb75b-371e-4062-89d5-372b8ff0effd',
  dynamicTemplateData: {name: 'Jimmy'},
  unsubscribeGroupUuid: '5ac48b43-6e7e-4c51-817d-f81ea0a09816',
  ipOrPoolUuid: '2e378fc9-3e23-4853-bccb-2990fda83ca9',
  attachments: [{content: 'dGVzdA==', filename: 'test.txt', type: 'text/plain', disposition: 'inline'}],
  headers: {'X-Testing': 'Test'},
  categories: ['Test'],
  clicktracking: true,
  opentracking: true,
  substitutions: {'sub1': 'replacement1'},
  sendAt: "2024-06-23T15:26:03-07:00"
}).then(msg => console.log(msg))
.catch(err => console.log(err.response));

```
