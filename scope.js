function jerry() {
  console.log(name);
}

function tom() {
  var name = 'tom';
  jerry();
}

var name = 'cartoon';

tom();


function tom2() {
  var name2 = 'tom';
  function jerry2() {
    console.log(name2);
  }
  jerry2();
}

var name2 = 'cartoon';

tom2();

function fnc() {
}
fnc.prototype.obj = {
  a: function() { console.log(this) },
  b: {
    c: () => {console.log(this)}
  }
}

const f = new fnc();
f.obj.a()
f.obj.b.c()