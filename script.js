// Ehkalu Moo
//Javascript 
//April 3, 2017
//Assignment# 11

















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
   var long_url = "http://bit.ly/2ptE3ia" ;
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
    document.getElementById("sharelist").innerHTML = '';
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
alert('Welcome');    populateshoppinglistonload();
    displayShoppinglists();
  savecookie();
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
    date.setTime(date.getTime() + Number(24) * 60 * 60 * 1000);
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
var btnaddcart =  '<label><input name="add" type="checkbox" id="adds" value="Add to Shopping Cart" onclick="addtoshopcart('+arrays+','+ i +')" style="visibility:hidden"  /><img  id="adds" src="https://cdn.pbrd.co/images/WG1QoCXf.png" alt=""/></label>';
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
var btnaddlist =  '<label><input name="add" type="checkbox" id="adds" value="Add to Shopping List" onclick="deleteShoppingCart(' + i + ')"  checked="checked" style="visibility:hidden"/><img  id="test" src="https://cdn.pbrd.co/images/61dedbPM3.png" alt=""/><br></label>';
var btnsharelist = '<input class="button" id="shares" name="shares" type="submit" value="Share " onclick="share()" />';
    TheRow =  "<li>" + addtocart[i] + btndelete + ' ' +  ' ' + btnaddlist + '<br></li>';
TheList += TheRow;
}
if (arrayLength > 0)
{
  document.getElementById("MyCart").innerHTML = '<hr><br><figure><img src="https://cdn.pbrd.co/images/Xcwu2usU.png" alt="pastboard.co" style="width:30px;height:30px;"></figure>' + '<ul>' + TheList + '</ul>';
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


