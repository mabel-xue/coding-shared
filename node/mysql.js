var mysql = require('mysql')
var connection = mysql.createConnection({
  host: '172.16.104.106',
  port: '3310',
  user: 'btsl_user',
  password: 'bQkNhhsNjjaIcWKR',
  database: 'bt_auth'
});
connection.connect();
connection.query(`select * from bt_auth.bt_menu_info where PRODUCT_CODE  in ('10B')`, function(err, results) {
  if (err) throw err;
  console.log('======start=====');
  const menu = {};
  results.map(item => {
    if (item.PARENT_MENU_ID === '-1') {
      if (item.ROUTING) {
        console.log(item.ROUTING + "\n\r" + item.NAME + '\n\r')
      } else {
        console.log('## '+item.NAME + ' ' + item.MENU_ID + '\n\r');
      }
    } else if (!item.ROUTING) {
      console.log('### '+item.NAME + ' ' + item.MENU_ID + '\n\r');
    } else {
      if (!menu[item.PARENT_MENU_ID]) {
        menu[item.PARENT_MENU_ID] = []
      }
      menu[item.PARENT_MENU_ID].push(item)
    }
  });
  for (const key in menu) {
    if (menu.hasOwnProperty(key)) {
      console.log("\n\r" + key + "\n\r");
      const arr = menu[key];
      arr.map(item => console.log(item.ROUTING + "\n\r" + item.NAME + '\n\r'))
    }
  }

  console.log('======end=======');
});

connection.end();