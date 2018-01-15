function Map() {
  this.keylist = [];
  this.valuelist = [];
  this.size = 0;
  this.clear = function () {
    this.keylist = [];
    this.valuelist = [];
    this.size = 0;
    return;
  }
  this.delete = function(key) {
    let n = this.keylist.indexOf(key)
    if (n == -1) {return false};
    this.keylist.splice(n,1);
    this.values.splice(n,1);
    this.size--;
    return true;
  }
  this.entries = function* () {
    for (let i = 0; i < this.keylist.length; i++) {
      yield [this.keylist[i], this.valuelist[i]];
    }
  }
  this.get = function (key) {
    let n = this.keylist.indexOf(key);
    if (n == -1) {return undefined};
    return this.values[n];
  }
  this.has = function (key) {
    return this.keylist.indexOf(key) != -1;
  }
  this.keys = function* () {
    for (let i = 0; i < this.keylist.length; i++) {
      yield this.keylist[i];
    }
  }
  this.set = function (key,value) {
    if (this.has(key)) {
      this.valuelist[this.keylist.indexOf(key)] = value;
      return this;
    }
    this.keylist.push(key);
    this.valuelist.push(value);
    this.size++;
    return this;
  }
  this.values = function* () {
    for (let i = 0; i < this.valuelist.length; i++) {
      yield this.valuelist[i];
    }
  }
}
let peeps = new Map();
let currentMsg;
module.exports = (client,msg) => {
  let msgs = msg.channel.messages.values();
  let finished = false;
  while (!finished) {
    currentMsg = msgs.next();
    let message = currentMsg.value;
    console.log(message);
    if (!peeps.has(message.author.id)) {
      peeps.set(message.author.id, 0);
    }
    peeps.set(message.author.id, peeps.get(message.author.id) + 1);
    finished = currentMsg.done;
  }
  let out = [];
  let put = peeps.entries();
  finished = false;
  while (!finished) {
    currentMsg = put.next();
    out.push(currentMsg.value);
    if (currentMsg.done) {
      finished = true;
    }
  }
  out.sort(function (a,b) {
    return a[1] > b[1];
  });
  msg.channel.send(out.reduce(function (accumulator, currentValue) {
    return accumulator + client.users.get(currentValue[0]).username + ": " + currentValue[1];
  }));
}