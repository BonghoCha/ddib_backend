// API 코드
// Author : KJ
// 2018.10.12
//
// Supplier Information GET APT 작성
// Author : KJ
// Modified-Date : 2018.10.13

var express = require('express');
var bodyParser = require('body-parser')

var hello = require('../api/hello.json')
var db = require('../lib/db')

var router = express.Router();

/* GET api home page. */
router.get('/', function(req, res, next) {
  res.send(hello);
});

router.post('/customer', function(req, res, next){
  var post = req.body;
  var id = post.cid;
  var passwd = post.passwd;

  db.query(`SELECT * FROM customer WHERE cid = ? AND passwd = ?;`, [id, passwd], function(error, customer) {
    if (error)
      throw error;
    
    var customer_json = {
      ID: customer[0].cid,
      passwd: customer[0].passwd,
      name: customer[0].name,
      address: customer[0].address
    }

    res.send(customer_json);
  })
})

// Supplier Information GET API
// Method : GET
// URL : /api/supplier/[suppleirID]
// 가맹업주의 정보를 제공하는 API
router.get('/supplier/:supplierID', function(req, res, next){
  var id =req.params.supplierID;

  db.query(`SELECT * FROM supplier WHERE sid = ?;`, [id], function(error, supplier) {
    if (error)
      throw error;

    var supplier_json = {
      ID: supplier[0].sid,
      rname: supplier[0].rname,
      address: supplier[0].address,
      dlprice: supplier[0].dlprice
    }

    res.send(supplier_json);
  })
})

// Category API
// Method : GET
// URL : /api/category
// 모든 카테고리를 반환하는 API
router.get('/category', function(req, res, next){

  db.query('SELECT * FROM category;', function(error, categorys){
    if (error)
      throw error;
    
    var category_json = {};
    var results = [];
    
    var i = 0;
    while (i < categorys.length)
    {
      results[i] = {
        ID : categorys[i].cateid,
        name : categorys[i].name
      }
      i++;
    }

    category_json['results'] = results;
    res.json(category_json);
  })
})

// Want_to_buy API
// Method : POST
// Parameters : cid, cateid, min_price, max_price
// URL : /api/wtb
// 삽니다 등록 api
router.post('/wtb', function(req, res, next){
  var post = req.body;
  var cid = post.cid;
  var cateid = post.cateid;
  var min_price = post.min_price;
  var max_price = post.max_price;

  db.query(`INSERT INTO want_to_buy (cid, cateid, min_price, max_price) VALUES (?, ?, ? ,?);`,
  [cid, cateid, min_price, max_price], function(error, result){
    if (error)
      throw error;
    
    res.send(result);
  })
})

module.exports = router;

