// Ehkalu Moo
//Javascript 
//April 3, 2017
//Assignment# 11


(function(global, factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define(function() {
      return new(factory(global, global.document))
    })
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = new(factory(global, global.document))
  } else {
    global.Push = new(factory(global, global.document))
  }
})(typeof window !== "undefined" ? window : this, function(w, d) {
  var Push = function() {
    var self = this,
      isUndefined = function(obj) {
        return obj === undefined
      },
      isString = function(obj) {
        return String(obj) === obj
      },
      isFunction = function(obj) {
        return obj && {}.toString.call(obj) === "[object Function]"
      },
      currentId = 0,
      incompatibilityErrorMessage = "PushError: push.js is incompatible with browser.",
      hasPermission = false,
      notifications = {},
      closeNotification = function(id) {
        var errored = false,
          notification = notifications[id];
        if (notification.close) {
          notification.close()
        } else if (notification.cancel) {
          notification.cancel()
        } else if (w.external && w.external.msIsSiteMode) {
          w.external.msSiteModeClearIconOverlay()
        } else {
          errored = true;
          throw new Error("Unable to close notification: unknown interface")
        }
        if (!errored) {
          return removeNotification(id)
        }
        return false
      },
      addNotification = function(notification) {
        var id = currentId;
        notifications[id] = notification;
        currentId++;
        return id
      },
      removeNotification = function(id) {
        var dict = {},
          success = false,
          key;
        for (key in notifications) {
          if (notifications.hasOwnProperty(key)) {
            if (key != id) {
              dict[key] = notifications[key]
            } else {
              success = true
            }
          }
        }
        notifications = dict;
        return success
      },
      createCallback = function(title, options) {
        var notification, wrapper, id, onClose;
        options = options || {};
        if (w.Notification) {
          try {
            notification = new w.Notification(title, {
              icon: isString(options.icon) || isUndefined(options.icon) ? options.icon : options.icon.x32,
              body: options.body,
              tag: options.tag,
              requireInteraction: options.requireInteraction
            })
          } catch (e) {
            if (w.navigator) {
              w.navigator.serviceWorker.register("sw.js");
              w.navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification(title, {
                  body: options.body,
                  vibrate: options.vibrate,
                  tag: options.tag,
                  requireInteraction: options.requireInteraction
                })
              })
            }
          }
        } else if (w.webkitNotifications) {
          notification = w.webkitNotifications.createNotification(options.icon, title, options.body);
          notification.show()
        } else if (navigator.mozNotification) {
          notification = navigator.mozNotification.createNotification(title, options.body, options.icon);
          notification.show()
        } else if (w.external && w.external.msIsSiteMode()) {
          w.external.msSiteModeClearIconOverlay();
          w.external.msSiteModeSetIconOverlay(isString(options.icon) || isUndefined(options.icon) ? options.icon : options.icon.x16, title);
          w.external.msSiteModeActivate();
          notification = {}
        } else {
          throw new Error("Unable to create notification: unknown interface")
        }
        id = addNotification(notification);
        wrapper = {
          get: function() {
            return notification
          },
          close: function() {
            closeNotification(id)
          }
        };
        if (options.timeout) {
          setTimeout(function() {
            wrapper.close()
          }, options.timeout)
        }
        if (isFunction(options.onShow)) notification.addEventListener("show", options.onShow);
        if (isFunction(options.onError)) notification.addEventListener("error", options.onError);
        if (isFunction(options.onClick)) notification.addEventListener("click", options.onClick);
        onClose = function() {
          removeNotification(id);
          if (isFunction(options.onClose)) {
            options.onClose.call(this)
          }
        };
        notification.addEventListener("close", onClose);
        notification.addEventListener("cancel", onClose);
        return wrapper
      },
      Permission = {
        DEFAULT: "default",
        GRANTED: "granted",
        DENIED: "denied"
      },
      Permissions = [Permission.GRANTED, Permission.DEFAULT, Permission.DENIED];
    self.Permission = Permission;
    self.Permission.request = function(onGranted, onDenied) {
      if (!self.isSupported) {
        throw new Error(incompatibilityErrorMessage)
      }
      callback = function(result) {
        switch (result) {
          case self.Permission.GRANTED:
            hasPermission = true;
            if (onGranted) onGranted();
            break;
          case self.Permission.DENIED:
            hasPermission = false;
            if (onDenied) onDenied();
            break
        }
      };
      if (w.Notification && w.Notification.requestPermission) {
        Notification.requestPermission(callback)
      } else if (w.webkitNotifications && w.webkitNotifications.checkPermission) {
        w.webkitNotifications.requestPermission(callback)
      } else {
        throw new Error(incompatibilityErrorMessage)
      }
    };
    self.Permission.has = function() {
      return hasPermission
    };
    self.Permission.get = function() {
      var permission;
      if (!self.isSupported) {
        throw new Error(incompatibilityErrorMessage)
      }
      if (w.Notification && w.Notification.permissionLevel) {
        permission = w.Notification.permissionLevel
      } else if (w.webkitNotifications && w.webkitNotifications.checkPermission) {
        permission = Permissions[w.webkitNotifications.checkPermission()]
      } else if (w.Notification && w.Notification.permission) {
        permission = w.Notification.permission
      } else if (navigator.mozNotification) {
        permission = Permissions.GRANTED
      } else if (w.external && w.external.msIsSiteMode() !== undefined) {
        permission = w.external.msIsSiteMode() ? Permission.GRANTED : Permission.DEFAULT
      } else {
        throw new Error(incompatibilityErrorMessage)
      }
      return permission
    };
    self.isSupported = function() {
      var isSupported = false;
      try {
        isSupported = !!(w.Notification || w.webkitNotifications || navigator.mozNotification || w.external && w.external.msIsSiteMode() !== undefined)
      } catch (e) {}
      return isSupported
    }();
    self.create = function(title, options) {
      if (!self.isSupported) {
        throw new Error(incompatibilityErrorMessage)
      }
      if (!isString(title)) {
        throw new Error("PushError: Title of notification must be a string")
      }
      if (!self.Permission.has()) {
        return new Promise(function(resolve, reject) {
          self.Permission.request(function() {
            try {
              resolve(createCallback(title, options))
            } catch (e) {
              reject(e)
            }
          }, function() {
            reject("Permission request declined")
          })
        })
      } else {
        return new Promise(function(resolve, reject) {
          try {
            resolve(createCallback(title, options))
          } catch (e) {
            reject(e)
          }
        })
      }
    };
    self.count = function() {
      var count = 0,
        key;
      for (key in notifications) {
        count++
      }
      return count
    }, self.close = function(tag) {
      var key;
      for (key in notifications) {
        notification = notifications[key];
        if (notification.tag === tag) {
          return closeNotification(key)
        }
      }
    };
    self.clear = function() {
      var i, success = true;
      for (key in notifications) {
        var didClose = closeNotification(key);
        success = success && didClose
      }
      return success
    }
  };
  return Push
});
//---------------------------------------

Push.create("Hello world!", {
  body: "It's a browser notification!",
  icon: 'http://download.seaicons.com/icons/paomedia/small-n-flat/32/sign-check-icon.png',
  timeout: 4000,
  onClick: function() {
    window.focus();
    this.close();
  }
});

$(document).ready(function() {
  $(".js-button").click(function() {
    Push.create("Hello world!", {
      body: "It's a browser notification!",
      icon: 'http://download.seaicons.com/icons/paomedia/small-n-flat/32/sign-check-icon.png',
      timeout: 4000,
      onClick: function() {
        window.focus();
        this.close();
      }
    });

  });
});


















function get(name){
    var url = window.location.search;
    var num = url.search(name);
    var namel = name.length;
    var frontlength = namel+num+1; //length of everything before the value
    var front = url.substring(0, frontlength);
    url = url.replace(front, "");
    num = url.search("&");
    if(num>=0) return url.substr(0,num);
    if(num<0)  return url;
}
//v4.1 ShareList via bitly api
function passlist()
{
   var getshorturl=0;
   var login = "mooehkalu";
   var api_key = "R_31fd2b259f19411b91590df93222a0f4";
   var long_url = "https://moolist.github.io/index.html?list=" + shoppinglist;
  try{
  $.getJSON(
             "https://api-ssl.bitly.com/v3/shorten?callback=?",
              {
      
             "format": "json",
              "apiKey": api_key,
             "login": login,
              "longUrl": long_url
              },
             function(response)
             {
                getshorturl = 1;
                document.getElementById("sharelist").innerHTML = '\n' + response.data.url;
                copyToClipboard(response.data.url);
                // copyToClipboard('sharelist');
                 //alert("ShoppingList URL Copied");
             });
  } catch(err) {
   //alert("Error : "+ err);
    document.getElementById("sharelist").innerHTML = 'Share List:';
    //copyToClipboard("sharelist");
    copyToClipboard(long_url);
    //alert("ShoppingList URL Copied");
}
}
//v4.1 share function
function share()
{
   passlist();
}
//v4.1 prompt message to copy URL
function copyToClipboard(text) {
   window.prompt("Copy & Share List!", text);
}

window.onload = function() {
alert('Welcome to my Shopping List App');    populateshoppinglistonload();
    displayShoppinglists();
    clearFocus();
};


//read cookie and return
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

//v. 4.0remove and format cookie
function remove_unwanted(str) {  
    
  if ((str===null) || (str===''))  
       return false;  
 else  
   str = str.toString();
    //clean space
   str = str.replace(/%20/g, " ");
    //clean !
    str = str.replace(/%21/g, "!");
   str = str.replace(/%24/g, "$"); 
   str = str.replace(/%7C/g, " | ");
  return str.replace(/[^\x20-\x7E]/g, '');  
}  


//v 4.0 save cookie
function savecookie()
{
  delete_cookie('moo');
   var date = new Date();
   //keeps for a year
    date.setTime(date.getTime() + Number(24) * 60 * 1000);
   document.cookie = 'moo' + "=" + escape(shoppinglist.join(',')) + "; path=/;expires = " + date.toGMTString();
}


//v 4.0 delete cookie
function delete_cookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function populateshoppinglistonload()
{
  shoppinglist = [];
  addtocart = [];
  //load cookie into array
  var y = readCookie('moo');
  //remove unwanted chars and format
  y = remove_unwanted(y); 
  //spit array by comma %2C
  
   //v 4.1 get URL
  var geturllistvalue = get("list");
    if (geturllistvalue) {
        geturllistvalue = remove_unwanted(geturllistvalue);
      geturllistvalue = geturllistvalue.split(',');
      shoppinglist = geturllistvalue;
  }else if (y){
       y = y.split('%2C');
      shoppinglist = y;
  }
}


var MyItems = {
  name:"",
  price:""
};

var shoppinglist = [];

//v 3.1 addtocart empty array
var addtocart = [];

//v3.1
function changeShoppinglist(position) {
  //document.getElementById("MyList").innerHTML = shoppinglist[position];
  var arrays = shoppinglist[position];
  arrays = arrays.split(",");
    var e1 = arrays[0];
   var e2 = arrays[1];
 var ReplacedAmount = e2.replace(/\$/g,'');
  var eitem = prompt("Please enter new item", e1);
  var ecost = prompt("Please enter your name", ReplacedAmount);
  shoppinglist[position] = eitem + "," + '$' + ecost;
  displayShoppinglists();
  displayShoppingCart();
  //v 4.0 save cookie
  savecookie();
}

//v3.1
function changeShoppingCart(position) {
  document.getElementById("MyCart").innerHTML = shoppinglist[position];
  var arrays = addtocart[position];
  arrays = arrays.split(",");
    var e1 = arrays[0];
   var e2 = arrays[1];
 var ReplacedAmount = e2.replace(/\$/g,'');
  var eitem = prompt("Please enter new item", e1);
  var ecost = prompt("Please enter your name", ReplacedAmount);
  addtocart[position] = eitem + "," + '$' + ecost;
  displayShoppinglists();
  displayShoppingCart();
  //v 4.0 save cookie
   savecookie();
}

//v3.1 
function addbacktoshoppinglist(item,num) {
  //push to deleteShoppingCar
   deleteShoppingCart(num);
  shoppinglist.push(item);
  //display shoppinglist
  displayShoppinglists();
//v3.1 display displayShoppingCart() 
  displayShoppingCart(); 
  clearFocus();
  //v 4.0 save cookie
   savecookie();
}

//v 3.1 Update function addShoppinglist by adding objects
function addtoshopcart(item, num) {
    document.getElementById("sharelist").innerHTML = ' ';
    deleteShoppinglists(num);
    addtocart.push(item);
  //display shoppinglist
  displayShoppinglists();
//v3.1 display displayShoppingCart() 
  displayShoppingCart(); 
  //Clear
  clearFocus();
  //v 4.0 save cookie
   savecookie();
}

//v 3.1 Update function addShoppinglist by adding objects
function addShoppinglist(item) {
  //v 3.0 declare variable for groc string
  //push to shoppinglist
  if (item != "")
  {
  document.getElementById("sharelist").innerHTML = ' ';
  shoppinglist.push(item);
  //display shoppinglist
  displayShoppinglists();
//v3.1 display displayShoppingCart() 
  displayShoppingCart(); 
  clearFocus();
  //v 4.0 save cookie
  savecookie();
  }else
  {
  alert("Item Description Required");
  clearFocus();
  }
}

function clearFocus()
{
  document.getElementById("item").value = "";
 //  document.getElementById("cost").value = "";
  document.getElementById("item").focus();
}




function displayShoppinglists() {

var TheList = "";
var arrayLength = shoppinglist.length;
for (var i = 0; i < arrayLength; i++) {
var btndelete =  ' <input name="delete" style="visibility:hidden" type="" value="" onclick="deleteShoppinglists(' + i + ')" />';
var arrays = shoppinglist[i];
arrays = "'"+arrays+"'";
var btnaddcart =  '<label><input name="add" type="checkbox" id="adds" value="Add to Shopping Cart" onclick="addtoshopcart('+arrays+','+ i +')" style="visibility:hidden"  /><img  id="adds" src="https://cdn.pbrd.co/images/61bOViCHY.png" alt=""/></label>';
var btnsharelist = '<input class="button" id="shares" name="shares" type="submit" value="Share" onclick="share()" />';

 TheRow = '<li>' + shoppinglist[i] + btndelete + ' '  + btnaddcart + '</li>';
TheList += TheRow;
}
//v3.1 add Title
if (arrayLength > 0)
{
  document.getElementById("MyList").innerHTML = '<ul>' + TheList + '</ul>';
document.getElementById("sharebutton").innerHTML = btnsharelist;

}else
{
  document.getElementById("MyList").innerHTML = '';
document.getElementById("sharebutton").innerHTML = '';
        document.getElementById("sharelist").innerHTML = ' ';

}
}

function displayShoppingCart() {
var TheList = "";
var arrayLength = addtocart.length;
for (var i = 0; i < arrayLength; i++) {
var btndelete =  ' <input name="delete" style="visibility:hidden" type="" value="" onclick="deleteShoppingCart(' + i + ')" />';
var btnupdate =  ' <input class="button" name="edit" type="button" value="Edit Item" onclick="changeShoppingCart(' + i + ')" />';
var arrays = addtocart[i];
arrays = "'"+arrays+"'";
var btnaddlist =  '<label><input name="add" type="checkbox" id="adds" value="Add to Shopping List" onclick="deleteShoppingCart(' + i + ')"  checked="checked" style="visibility:hidden"/><img  id="test" src="https://cdn.pbrd.co/images/61dedbPM3.png" alt=""/></label>';
var btnsharelist = '<input class="button" id="shares" name="shares" type="submit" value="Share " onclick="share()" />';
    TheRow =  "<li>" + addtocart[i] + btndelete + ' ' +  ' ' + btnaddlist + '<br></li>';
TheList += TheRow;
}
if (arrayLength > 0)
{
  document.getElementById("MyCart").innerHTML = '<figure><img src="https://cdn.pbrd.co/images/60KZlQAeX.png" alt="pastboard.co" style="width:30px;height:30px;"></figure>' + '<br><ul>' + TheList + '</ul>';
}else{
  document.getElementById("MyCart").innerHTML = '';
}
}


//v3.1
function deleteShoppinglists(position) {
document.getElementById("sharelist").innerHTML = ' ';
  shoppinglist.splice(position, 1);
  displayShoppinglists();
  displayShoppingCart();
   //v 4.0 save cookie
  savecookie();
}
//v3.1
function deleteShoppingCart(position) {
document.getElementById("sharelist").innerHTML = ' ';
  addtocart.splice(position, 1);
  displayShoppinglists();
  displayShoppingCart();
}


