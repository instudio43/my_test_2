(function() {
  setCookie = function(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  },
  getCookie = function(name) {
    var nameEQ = name + "=";
    var ca = window.parent.document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };
  //subscriber revenue
  var url = new URL(window.location.href);
  var psID = url.searchParams.get("s-id");
  if(psID) {
    setCookie('ps_id', psID, 3650);
  } else {
    psID = getCookie('ps_id');
  }
  if(psID && Shopify && Shopify.checkout && Shopify.checkout.order_id){
    try{
      var xhr = new XMLHttpRequest();
      var url = "https://api.postscript.io/api/subscriber_event";
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      var data = JSON.stringify({
        "subscriber_id": psID, 
        "event": "purchase",
        "data": {
          "order_id": Shopify.checkout.order_id
        }
      });
      xhr.send(data);
    } catch(e){}
  };
})()