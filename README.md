# DDIB BACKEND

## author : KJ

## 설치

### 요구사항
* nodejs 8.x <br />
* npm <br />
* mysql <br />

### 다운로드 & 설치
```
git clone https://github.com/KyungjeCho/test_ddib_backend.git
```
```
cd test_ddib_backend
```
mysql에 ddib 데이터베이스가 존재해야 하므로 실행한다. user_id에는 본인 데이터베이스 아이디를 적는다.
다른 데이터베이스를 이용할 경우 하지 않아도 된다. 
```
mysql -uuser_id -p

create databases ddib;

use ddib;

exit;

mysql -uuser_id -p ddib < ddib_test_db.sql
```
npm install로 코드에서 요구하는 미들웨어를 설치한다.
```
npm install
```
데이터베이스 템플릿을 이용하여 데이터베이스 코드를 작성한다.
비밀번호 암호화 키를 작성하기 위해 passwordSecrete.js를 만들어 사용자가 암호화 키를 입력한다.
```
cp ./lib/db.template.js ./lib/db.js
cp ./lib/passwordSecret.template.js ./lib/passwordSecret.js 
```
gedit이나 vi(m) 이나 다른 ide로 ./lib/db.js 파일을 수정한다.

USE gedit or vi(m) or other text editor to write ./lib/db.js
```
var mysql = require('mysql');

var db = mysql.createConnection({ 
  host:'[localhost]', <- 데이터베이스 서버 입력
  user:'[username]', <- 데이터베이스 유저 입력
  password:'[password]', <- 데이터베이스 비밀번호 입력
  database:'[dbname]' <- ddib 입력
});

db.connect();

module.exports = db;
```
```
var CryptoPasswd = {
    secret : '', // <- 암호화 키 입력
    create : function(password){
      const encrypted = crypto.createHmac('sha1', this.secret)
                              .update(password)
                              .digest('base64')
      return encrypted;
    },
    verify : function(encrypted_password, password) {
      const encrypted = crypto.createHmac('sha1', this.secret)
                              .update(password)
                              .digest('base64')
      return encrypted === encrypted_password;
    }
  }

module.exports = CryptoPasswd;
```
서버 시작하기 위해 돌린다. window cmd로는 DEBUG=를 할 수 없다.
```
DEBUG=ddib:* npm start
```
혹은, 만약 코드를 새로 고칠때마다 서버에 적용하고 싶으면 nodemon 패키지를 다운로드 받고 실행한다.
```
npm install -g nodemon 
nodemon bin/www
```

입력한 서버로 들어간다.
enter [localhost]:3000/api

카테고리 api를 테스트한다.
 localhost:3000/api/category

## API

### **/category** 
- *Method : GET* 
- URL : [server-name]/api/category 
- Return : json file including all category
- Example : { results: [{ID: ,name: }, ...]}  

### **/wishlist** 
- *Method : POST* 
- Params : iid
- URL : [server-name]/api/wishlist 
- Return : true or false
- Example : { success : true } or { success : false } or Unauthorized

### **/faq** 
- *Method : POST* 
- Params : token, question, answer
- URL : [server-name]/api/faq 
- Return : success check
- Example : { success : true } or Unantherized or { success : false }

### **/shopping_cart_history** 
- *Method : GET* 
- URL : [server-name]/api/shopping_cart_history 
- Return : json file including all shopping_cart 
- Example :  [{
        ItemID : ,
        Amount : ,
        sid : ,
        name : ,
        category_id : ,
        sale_price : ,
        image_path : ,
        start_time : ,
        end_time : ,
        deliverable : ,
        item_count : 
      }, ...]  

### **/order_history/customer** 
- *Method : GET* 
- URL : [server-name]/api/order_history/customer
- Return : json file including user's order history
- Example : { success : false } or [{
        gid : ,
        cid : ,
        order_date : ,
        payment : ,
        oid : ,
        iid : ,
        order_state : ,
        time : ,
        sid : ,
        name : ,
        cateid : ,
        sale_price : ,
        image_path : 
      }]

### **/order_history/supplier** 
- *Method : GET* 
- URL : [server-name]/api/order_history/supplier
- Return : json file including user's order history
- Example : { success : false } or [{
        oid : ,
        iid : ,
        amount : ,
        order_state : ,
        time : ,
        gid : , 
        name  : ,
        sale_price : ,
        cid : ,
        order_date : ,
        payment : 
      }]


### **/shopping_cart** 
- *Method : POST* 
- Header : Authorization
- Params : iid, amount
- URL : [server-name]/api/shopping_cart
- Return : { success : true } or {success : false } or Unauthorizated
- Example : { success : true } or { success : false } or Unauthorizated

### **/order**
- *Method : POST* 
- Params : payment, iid, amount, time, length
- Headers : Authorization
- URL : [server-name]/api/order 
- Return : { success : boolean }
- Example : { success : true } or { success : false } or UnAuthorizion

### **/item** 
- *Method : POST* 
- URL : [server-name]/api/item
- Headers : Authorization
- Params : sid, name, category_id, raw_price, sale_price, context, start_time, end_time, deliverable, count
- Return : { success : boolean }
- Example : { success : true }

### **/item/detail/:itemID** 
- *Method : GET* 
- URL : [server-name]/api/item/:itemID
- Return : { success : false } or 
 {
    success : true,
    iid : iid,
    itemName : name.
    rawPrice : raw_price,
    salePrice : sale_price,
    context : context,
    views : views,
    startTime : start_time.
    endTime : end_time.
    delivable : 0 or 1,
    supplierId : sid.
    categoryId : cateid.
    imagePath : image.
    itemCount : count
}

### **/item/list/:sort** 
- *Method : GET* 
- URL : [server-name]/api/list/:sort
- Return : { success : false } or 
 [{ 
    success : true,
    iid : iid,
    itemName : name.
    rawPrice : raw_price,
    salePrice : sale_price,
    context : context,
    views : views,
    startTime : start_time.
    endTime : end_time.
    delivable : 0 or 1,
    supplierId : sid.
    categoryId : cateid.
    imagePath : image.
    itemCount : count
}, ... ]

### **/item/search** 
- *Method : POST* 
- Params : name or cateid or sid
- URL : [server-name]/api/item/search 
- Return : json file 
- Example : [{ success : true, iid : 29, itemName : , rawPrice : , salePrice : , context : , views : , startTime : , endTime : , deliverable : , supplierId : , categoryId : , imagePath : }, ...]

### **/shopping_cart/update** 
- *Method : POST* 
- Params : iid, amount
- URL : [server-name]/api/shopping_cart/update
- Return : json file 
- Example : { success : true } or { success : false }

### **/shopping_cart/delete** 
- *Method : POST* 
- Headers : Authorization
- Params : iid
- URL : [server-name]/api/shopping_cart/delete
- Return : json file 
- Example : { success : true } or { success : false }

### **/supplier/detail/item/:ItemID** 
- *Method : GET* 
- URL : [server-name]/api/supplier/detail/item/:ItemID 
- Return : json file including a supplier informaton
- Example : [ { sid:, rname :, latitude :, longitude :, address :, dlprice : }] 

### **/sign_up/customer** 
- *Method : POST* 
- Params : cid, passwd, name, address, latitude, longitude
- URL : [server-name]/api/sign_up/customer 
- Return : json file 
- Example : { success : true } or { success : false } or {success : false, idError : true, passwdError : false }

### **/sign_up/supplier** 
- *Method : POST* 
- Params : sid, passwd, rname, address, dlprice, latitude, longitude
- URL : [server-name]/api/sign_up/supplier 
- Return : json file 
- Example : { success : true } or { success : false } or {success : false, idError : true, passwdError : false }

### **/login/customer**
- *Method : POST*
- Parameter : cid=[customer_id]&passwd=[password]
- URL : [server-name]/auth/login/customer
- Return : {success : true, token : '[random_string]'} or {success : false, error : true }
- Example : {success : true, token : '[random_string]'} or {success : false, error : true }

### **/login/supplier**
- *Method : POST*
- Parameter : sid=[customer_id]&passwd=[password]
- URL : [server-name]/auth/login/supplier
- Return : {success : true, token : '[random_string]', ID : '[supplier id]', rname : '[restaurant]'} or {success : false, error : true }

### **/logout/customer**
- *Method : GET*
- URL : [server-name]/auth/logout/customer
- Return : "Logout!"
- Example : Logout!

### **/alarm** 
- *Method : POST* 
- Params : cid
- URL : [server-name]/api/alarm
- Return : json file including an item that the customer bought the most
- Example : { success : true, id : 1, sid : '010-9999-1111', name : '순대국' } or { success : false } 

## Slack

ddib-backend.slack.com

