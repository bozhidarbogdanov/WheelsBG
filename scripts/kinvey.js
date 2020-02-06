const kinvey = (() => {
  const BASE_URL = "https://baas.kinvey.com/";
  const APP_KEY = "kid_HJy7oc_MI"; // APP KEY HERE
  const APP_SECRET = "813204075d414e65a57714a0e4da5867"; // APP SECRET HERE

  function makeAuth(auth) {
    if (auth === "basic") {
      return {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(APP_KEY + ":" + APP_SECRET)}`
      };
    } else {
      return {
        "Content-Type": "application/json",
        Authorization: `Kinvey ${sessionStorage.getItem("authtoken")}`
      };
    }
  }

  function makeRequest(reqMethod, collection, endpoint, auth) {
    let url = BASE_URL + collection + "/" + APP_KEY + "/" + endpoint;
    let method = reqMethod;
    let headers = makeAuth(auth);

    return (request = { url, method, headers });
  }

  async function post(collection, endpoint, auth, data) {
    let req = makeRequest("POST", collection, endpoint, auth);

    let body = JSON.stringify(data);

    let res = await fetch(req.url, {
      method: req.method,
      headers: req.headers,
      body
    });
   if(res.status===204){
     return res;
   }else{
   let result = await res.json();
   return result;
   }
  }

  async function get(collection, endpoint, auth) {
    let req = makeRequest("GET", collection, endpoint, auth);

    let res = await fetch(req.url, {
      method: req.method,
      headers: req.headers
    });

    if (res.status === 200) {
      let result = await res.json();
      return result;
    } else {
      return res;
    }
  }

  async function update(collection, endpoint, auth, data) {
    let req = makeRequest("PUT", collection, endpoint, auth);
    let body=JSON.stringify(data);
    let res=await fetch(req.url,{
      method:req.method,
      headers:req.headers,
      body
    });
    let result =await res.json();
    return result;
  }

  async function remove(collection, endpoint, auth) {
    let req = makeRequest("DELETE", collection, endpoint, auth);
    let res = await fetch(req.url,{
      method:req.method,
      headers:req.headers
    });
    return res;
  }

  return {
    get,
    post,
    update,
    remove
  };
})();
