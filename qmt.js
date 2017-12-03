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
let votescreens = new Map();
let votes = [];
let queue = [];
let contestantList = [];
let status = "none";
let restime;
let vottime;
let contestantLimit;
let responses = [];
let host;
let args;
let argusQmt = {
  "queue": " [contestantLimit] [restime] [vottime]"
}
let valuesQmt = {
  "queue": "*Queues you to host a QMT for a maximum of [contestantLimit] contestants with [restime] minutes for each response period and [vottime] minutes for each voting period.*"
}
let argdescsQmt = {
  "queue": "*[contestantLimit]: A positive integer above 2.*\n*[restime]: A positive rational decimal.*\n*[vottime]: A positive rational decimal.*"
}
    
module.exports = (client,msg) => {
    
  switch (msg.content.split(/ +/g)[0]) {
    case "qmt$queue":
      args = msg.content.split(/ +/g);
      for (let i = 0; i < queue.length; i++) {
        if (msg.author == queue[i][0]) {
          msg.channel.send("No queueing twice.");
          return 0;
        }
      }
      switch (args.length) {
        case 1:
          queue.push([msg.author,Infinity,5*60*1000,4*60*1000]);
          msg.channel.send("You've been queued with no contestant limit, a responding timer of " + 5 + " minutes, and a voting time of " + 4 + " minutes.");
          break;
        case 2:
          try {
            queue.push([msg.author,parseFloat(args[1]),5*60*1000,4*60*1000]);
            msg.channel.send("You've been queued with a maximum of " + parseFloat(args[1]) + ", a responding timer of " + 5 + " minutes, and a voting time of " + 4 + " minutes.");            
          } catch (e) {
            if (args[1] == "d") {
              queue.push([msg.author,Infinity, 5*60*1000,4*60*1000]);
              msg.channel.send("You've been queued with no contestant limit, a responding timer of " + 5 + " minutes, and a voting time of " + 4 + " minutes.");
            } else {
              msg.channel.send("That's not a valid response time, you idiot.");
            }
          } 
          break;
        case 3: 
          try {
            contestantLimit = (parseInt(args[1])>1) ? parseInt(args[1]) : "error";
          } catch (e) {
            if (args[1] == "d") {
              contestantLimit = Infinity;
            } else {
              msg.channel.send("Huh? That isn't even an integer last I checked.");
              break;
            }
          }
          try {
            restime = (parseFloat(args[2])>0) ? parseFloat(args[2]) : "error";
          } catch (e) {
            if (args[2] == "d") {
              restime = 5;
            } else {
              msg.channel.send("Huh? That's not a decimal, last I checked.");
              break;
            }
          }
          if (contestantLimit == "error") {
            msg.channel.send("That's either 1, 0, or a negative integer. All of which aren't positive and above 2.");
            break;
          }
          if (restime == "error") {
            msg.channel.send("That's not positive. I can't respond in negative/zero time!");
            break;
          }
          queue.push(contestantLimit,restime*60*1000,4*60*1000);
          msg.channel.send("You've been queued with a maximum of " + contestantLimit + ", a responding timer of " + restime + " minutes, and a voting time of " + 4 + " minutes.");
          break;
        case 4:
          try {
            contestantLimit = (parseInt(args[1])>1) ? parseInt(args[1]) : "error";
          } catch (e) {
            if (args[1] == "d") {
              contestantLimit = Infinity;
            } else {
              msg.channel.send("Huh? That isn't even an integer last I checked.");
              break;
            }
          }
          try {
            restime = (parseFloat(args[2])>0) ? parseFloat(args[2]) : "error";
          } catch (e) {
            if (args[2] == "d") {
              restime = 5;
            } else {
              msg.channel.send("Huh? That's not a decimal, last I checked.");
              break;
            }
          }
          try {
            vottime = (parseFloat(args[3])>0) ? parseFloat(args[3]) : "error";
          } catch (e) {
            if (args[3] == "d") {
              restime = 5;
            } else {
              msg.channel.send("Huh? That's not a decimal, last I checked.");
              break;
            }
          }
          if (contestantLimit == "error") {
            msg.channel.send("That's either 1, 0, or a negative integer. All of which aren't positive and above 2.");
            break;
          }
          if (restime == "error") {
            msg.channel.send("That's not positive. I can't respond in negative/zero time!");
            break;
          }
          if (vottime == "error") {
            msg.channel.send("That's not positive. I can't respond in negative/zero time!");
            break;
          }
          queue.push(contestantLimit,restime*60*1000,vottime*60*1000);
          msg.channel.send("You've been queued with a maximum of " + contestantLimit + ", a responding timer of " + restime + " minutes, and a voting time of " + vottime + " minutes.");
          break;
        default:
          msg.channel.send("Too many arguments! Which do you want me to freakin' use?");
      }
      if (status == "none") {
        client.channels.get("381995396584570880").send(queue[0][0] + " It's your turn to host a QMT!");
        client.channels.get("381995396584570880").send("You wanted to host a QMT with a max of " + (contestantLimit) ? contestantLimit : "infinity" + " contestants, " + queue[0][2]/60/1000 + " minutes for responding, and " + queue[0][3]/60/1000 + " minutes for voting.");
        status = "signups";
        host = queue[0][0];
      }
      break;
    case "qmt$join": 
      if (status = "none") {
        msg.channel.send("There's no QMT in progress. Maybe later?");
      } else {
        if (status = "signups") {
          contestantList.push(msg.author.id);
          msg.channel.send("Great! You're in!");
          client.channels.get("381995396584570880").send(msg.author.username + " just joined! There are now " + contestantList.length + " contestants!");
        } else {
          msg.channel.send("Whoops, ya joined late. Try again later.");
        }
      }
      if (contestantList.length == contestantLimit) {
        status = "promptreq";
        client.channels.get("381995396584570880").send("The qmt hosted by " + msg.author + " has begun with " + contestantList.length + " contestants! Would the host, " + msg.author.username + " please send a prompt?");
      }
      break;
    case "qmt$start":
      if (msg.author != host) {
        msg.channel.send("Hey, you aren't the host! Get out!");
        return;
      }
      status = "promptreq";
      client.channels.get("381995396584570880").send("The qmt hosted by " + msg.author + " has begun with " + contestantList.length + " contestants! Would the host, " + msg.author.username + " please send a prompt?");
      break;
    case "qmt$help":
      args = msg.content.split(/ +/g);
      try {
        msg.channel.send({embed: {
            color: 4369908,
            title: "qmt$" + args[1] + argusQmt[args[1]],
            fields: [
              {
                name: "**Functions**", 
                value: valuesQmt[args[1]]
              },
              {
                name: "**Arguments**",
                value: argdescsQmt[args[1]]
              }
            ],
            timestamp: new Date(),
            footer: {
              text: "Contact PMP#5728 for all issues."
            }
          } 
        });
      } catch (e) {
        msg.channel.send("qmt$" + args[1] + " isn't even a command, you bozo.");
      }
      break;
    case "qmt$vote":
      if (msg.channel.type != "dm") {
        msg.channel.send("Keep your votes private, ya bum."); 
        return;
      }
      args = msg.content.split(/ +/g);
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
    default:
      msg.channel.send("That's not a valid command. Try qmt$help.");
  }
}
