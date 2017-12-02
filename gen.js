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
    for (let i = 0; i < this.keys.length; i++) {
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
let vscreens = new Map();
let weights = new Map();
let votes = [];
let names = ["lmao","lmaoo","lmaooo","lmaoooo","lmaooooo"];
let responses = ["Keep sweating. Sweat is liquid, and liquids kill fires, right?","Strangle yourself, so you'll never burn to death, just suffocate.","Dash for the nearest water source! Preferably an unpolluted one.","I'm a \"How To Escape A Fire\" book! ...Won't help."];
for (let i = 0; i < responses.length; i++) {
  votes.set(i, []);
}
function avg(arr) {
  return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0)/arr.length;
}
function stdev(arr) {
  let avg = avg(arr);
  return Math.sqrt(arr.reduce((accumulator, currentValue) => accumulator + (avg-currentValue)*(avg-currentValue), 0)/(arr.length-1));
}
function factorial(n) {
  if (n == 0 || n == 1) {return 1};
  return factorial(n-1)*n;
}
function factbase(n,minlen) {
  let factlog = 0;
  let res = [];
  for (let i = 1; factorial(i) <= n; i++) {
    factlog++;
    res.push(0);
  }
  for (let i = factlog; i>0; i--) {
    while (n >= factorial(i)) {
      res[factlog-i]++;
      n -= factorial(i);
    }
  }
  while (res.length < minlen) {
    res.unshift(0);
  }
  return res;
}
module.exports = (msg) => {
    let argusGen = {
      "help": " [cmd]",
      "vote-screen": ""
    }
    let valuesGen = {
      "help": "Geez, I thought you knew how gen$help worked if you're flipping using it.\nBut because this is still a flipping help message, here's your damned info.\n*Gives information about gen$[cmd].*",
      "vote-screen": "Gives you a random voting screen."
    }
    let argdescsGen = {
      "help": "*[cmd]: A valid command in module gen.*",
      "vote-screen": "No arguments."
    }
    if (msg.content == "gen$help") {
      msg.channel.send({embed: {
          color: 4369908,
          title: "A Guide to the Proper Use of this Automatically Functioning Robot",
          description: "Need help? Get it here.",
          fields: [
            {
              name: "Modules",
              value: "*gen (**gen**eral)\nqmt (**Q**uick **M**ini**T**WOWs)"
            },
            {
              name: "gen (**gen**eral)",
              value: "*gen$help*\n*gen$vote-screen*\n*gen$request*"
            },
            {
              name: "qmt (**Q**uick **M**ini**T**WOWs) [NOT FUNCTIONING]",
              value: "*qmt$help\nqmt$queue\nqmt$join\nqmt$respond\nqmt$vote-screen\nqmt$vote*"
            },
            {
              name: "For help on a specific command (of the form [module]$[command])...",
              value: "...type [module]$help [command]."
            }
          ],
          timestamp: new Date(),
          footer: {
            text: "Contact PMP#5728 for all issues."
          }
        }
      });
    } else if (msg.content.startsWith("gen$help")) {
      let args = msg.content.split(/ +/g);
      try {
        msg.channel.send({embed: {
            color: 4369908,
            title: "gen$" + args[1] + argusGen[args[1]],
            fields: [
              {
                name: "**Functions**", 
                value: valuesGen[args[1]]
              },
              {
                name: "**Arguments**",
                value: argdescsGen[args[1]]
              }
            ],
            timestamp: new Date(),
            footer: {
              text: "Contact PMP#5728 for all issues."
            }
          } 
        });
      } catch (e) {
        msg.channel.send("gen$" + args[1] + " isn't even a command, you bozo.");
      }
    } else if (msg.content.startsWith("gen$vote-screen")) {
        if (msg.channel.type != "dm") {
          msg.channel.send("Keep your votes private, ya bum."); 
          return;
        }
        if (!votescreens.has(msg.author.id)) {
          votescreens.set(msg.author.id, []);
        }
        placeholder = responses;
        goto = [];
        let index = Math.floor(Math.random()*names.length);
        let screenName = names[n]; 
        out = "Screen " + screenName + ":\n";
        for (let i = 0; i < responses.length && i < 10; i++) {
          let n = Math.floor(Math.random()*placeholder.length);
          out += String.fromCharCode(65+i);
          out += placeholder[n];
          goto.push(placeholder[n]);
          let k = placeholder[n].split(/ +/g).length;
          out += " (**" + k + (k == 1) ? "** word)" : "** words)" + (k > 10) ? " ***OVER TEN WORDS VOTE DOWN***\n" : "";
          placeholder.splice(n,1);
        }
        msg.channel.send(out);
        names.splice(index,1);
        msg.channel.send("Vote with gen$vote [screenName] [vote] to me!");
        vscreens.set(screenName, goto);
    } else if (msg.content.startsWith("gen$vote")) {
      if (msg.channel.type != "dm") {
        msg.channel.send("Keep your votes private, ya bum."); 
        return;
      }
      let args = msg.content.split(/ +/g);
      let len = Math.min(10,responses.length);
      try {
        if (votescreens.get(msg.author.id).indexOf(args[1]) == -1) {
          msg.channel.send("I don't recall sending you that screen. Try again? Make sure the screen name matches what I sent you perfectly.");
          return;
        }
      } catch (e) {
        msg.channel.send("I didn't even send you a single voting screen.");
        return;
      }
      let vote = [];
      for (let i = 0; i < args[2].length; i++) {
        if (args[2].charCodeAt(i) > 65 + len - 1 || args[2].charCodeAt(i) < 65) {
          msg.channel.send("Invalid character detected!\n```\n" + vote + "\n" + " ".repeat(vote.length-args[2].length+i) + "^" + "\n```\nAre you sure you used only capital letters and numbers in your vote?");
          return;
        }
        vote.push(args[2].charAt(i));
      }
      let out = [];
      out.push(msg.author.id);
      for (let i = 0; i < responses.length; i++) {
        out.push(-1);
      }
      let thisscreen = vscreens.get(args[1]);
      let omit = (len - vote.length);
      let omitscore = omit*(omit - 1) / 2 / (len-1);
      for (let i = 0; i < len; i++) {
        if (vote.indexOf(String.fromCharCode(65+i)) == -1) {
          out[responses.indexOf(thisscreen[i])] = omitscore;
          continue;
        }
        out[responses.indexOf(thisscreen[i])] = (len-vote.indexOf(String.fromCharCode(65+i))-1)/(len-1);
      }
      votes.push(out);
      if(weights.has(msg.author.id)) {
        weights.set(msg.author.id,weights.get(msg.author.id)+1);
      } else {
        weights.set(msg.author.id,1);
      }
      msg.channel.send("Your vote on " + args[1] + " of " + args[2] + " has been recorded. Have a good day.");
      client.users["248953835899322370"].send(msg.author.username + " voted with the following array: [" + out.join(", ") + "]");
    } else {
      msg.channel.send("That's not a command in gen, you know. Try gen$help.");
    }
  }
