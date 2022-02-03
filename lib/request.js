const cacheableLookup = require('cacheable-lookup');
const https = require('https');
const fetch = require('node-fetch');
const qs = require('qs');

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

class APIException extends Error {
  constructor(response, text) {
    super('An error occurred while making an API request');
    this.status = response.status;
    this.text = text || response.statusText;
  }
}

class ValidationException extends Error {
  constructor(errors) {
    super('A validation error occurred while making an API request');
    this.errors = errors;
  }
}

class ResourceNotFoundException extends Error {
  constructor(errors) {
    super('The resource was not found while making an API request');
    this.errors = errors;
  }
}

async function checkResponse(response) {
  if (response.status === 204) {
    return;
  }
  else if (response.redirected) {
    return response.url;
  }
  else if (response.status === 401 || response.status === 403) {
    throw new APIException(response);
  }
  else if (response.status === 404) {
    const json = await response.json();
    throw new ResourceNotFoundException(json.errors);
  }
  else if (response.status === 422) {
    const json = await response.json();
    throw new ValidationException(json.errors);
  }
  else if (response.status < 200 || response.status >= 300) {
    // For any other non-2xx response, throw a new error with the response text
    const text = await response.text();
    throw new APIException(response, text);
  }

  return response.json();
}

class Request {
  constructor(config) {
    this.config = config;
    this.httpsAgent = new https.Agent();
    this.dnsCache = new cacheableLookup;
    this.dnsCache.install(this.httpsAgent);
  }

  async get(path, params, options = {}) {
    const headers = { ...DEFAULT_HEADERS, ...options.headers };

    let fullPath = path;
    if (params && Object.entries(params).length > 0) {
      const serializedParams = qs.stringify(params, {
        encodeValuesOnly: true,
        arrayFormat: 'brackets',
      });
      fullPath = `${fullPath}?${serializedParams}`;
    }

    const response = await fetch(fullPath, {
      credentials: 'same-origin',
      agent: this.httpsAgent,
      headers,
    });

    return checkResponse(response);
  }

  async post(path, body, options = {}) {
    const headers = {
      ...DEFAULT_HEADERS,
      ...options.headers,
      ...this.authHeader(),
    };

    const response = await fetch(`${this.config.url}${path}`, {
      body: JSON.stringify(body),
      credentials: 'same-origin',
      agent: this.httpsAgent,
      headers,
      method: 'POST',
    });

    return checkResponse(response);
  }

  async put(path, body, options = {}) {
    const headers = { ...DEFAULT_HEADERS, ...options.headers };

    let parsedBody;
    if (body instanceof FormData) {
      delete headers['Content-Type'];
      parsedBody = body;
    }
    else {
      parsedBody = JSON.stringify(body);
    }

    const response = await fetch(path, {
      body: parsedBody,
      credentials: 'same-origin',
      agent: this.httpsAgent,
      headers,
      method: 'PUT',
    });

    return checkResponse(response);
  }

  async del(path, options = {}) {
    const headers = { ...DEFAULT_HEADERS, ...options.headers };

    const response = await fetch(path, {
      credentials: 'same-origin',
      agent: this.httpsAgent,
      headers,
      method: 'DELETE',
    });

    return checkResponse(response);
  }

  authHeader() {
    return { Authorization: `Bearer ${this.config.accessToken}` };
  }
}

module.exports = Request;
