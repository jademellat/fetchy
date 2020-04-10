const fetchy = (function () {
  let fetchWrapper = function (endpoint) {
    this.message =
      "Fetchy: Please provide URL and method, eg: fetchy().get('http://endpoint...')";
    if (!endpoint) throw new Error(this.message);
    this.endpoint = apiPrefix + endpoint;
  };

  fetchWrapper.prototype.sendRequest = async function (path, config) {
    let sendTemplate = { headers: { 'Content-Type': 'application/json' } };
    sendTemplate = Object.assign(sendTemplate, config);
    let clone, error, data, res;

    try {
      res = await fetch(path, sendTemplate);
    } catch (err) {
      return { error: err };
    }

    if (!res.ok) {
      return { error: res };
    }
    // TRY for JSON response and return it if success
    try {
      clone = res.clone();
      data = await res.json();
      return data;
    } catch (err) {
      error = err;
    }
    // TRY for text response
    try {
      data = await clone.text();
      return data;
    } catch (err) {
      error = err;
    }

    return error;
  };

  fetchWrapper.prototype.checkValidObject = function (dataObj, method) {
    if (!dataObj) {
      throw new Error(
        `Fetchy: You cannot ${method} or put without passing Object to fetchy!`
      );
    }

    if (dataObj.constructor !== Object) {
      throw new Error(
        `Fetchy: Only unstringified objects can be passed to ${method} method!`
      );
    }
  };

  fetchWrapper.prototype.get = function () {
    return this.sendRequest(this.endpoint, { method: 'GET' });
  };

  fetchWrapper.prototype.post = function (dataObj) {
    this.checkValidObject(dataObj, 'POST');
    return this.sendRequest(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(dataObj)
    });
  };

  fetchWrapper.prototype.put = function (dataObj) {
    this.checkValidObject(dataObj, 'PUT');
    return this.sendRequest(this.endpoint, {
      method: 'PUT',
      body: JSON.stringify(dataObj)
    });
  };

  fetchWrapper.prototype.delete = function () {
    return this.sendRequest(this.endpoint, { method: 'DELETE' });
  };

  let fetchInstance = function (endpoint = null) {
    return new fetchWrapper(endpoint);
  };

  return fetchInstance;
})();

export default fetchy;
