let queue = [];
let contestantList = [];
let qmtInSession = false;
let inSignups = false;
let restime;
let vottime;
let contestantLimit;
let votescreens = new Map();
function factorial(n) {
  if (n == 0 || n == 1) {return 1};
  return factorial(n-1)*n;
}
function factbase(n,minlen) {
  factlog = 0;
  res = [];
  for (i = 1; factorial(i) <= n; i++) {
    factlog++;
    res.push(0);
  }
  for (i = factlog; i>0; i--) {
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
module.exports = (client,msg) => {
    argusQmt = {
      "queue": " [contestantLimit] [restime] [vottime]"
    }
    valuesQmt = {
      "queue": "*Queues you to host a QMT for a maximum of [contestantLimit] contestants with [restime] minutes for each response period and [vottime] minutes for each voting period.*"
    }
    argdescsQmt = {
      "queue": "*[contestantLimit]: A positive integer above 2.*\n*[restime]: A positive rational decimal.*\n*[vottime]: A positive rational decimal.*"
    }
    args = msg.content.split(/ +/g);
    switch (args[0]) {
      case "qmt$queue":
        for (i = 0; i < queue.length; i++) {
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
        if (!qmtInSession) {
          client.channels.get("381995396584570880").send(queue[0][0] + " It's your turn to host a QMT!");
          client.channels.get("381995396584570880").send("You wanted to host a QMT with a max of " + (contestantLimit) ? contestantLimit : "infinity" + " contestants, " + queue[0][2]/60/1000 + " minutes for responding, and " + queue[0][3]/60/1000 + " minutes for voting.");
          qmtInSession = true;
          inSignups = true;
          host = queue[0][0];
        }
        break;
      case "qmt$join": 
        if (!qmtInSession) {
          msg.channel.send("There's no QMT in progress. Maybe later?");
        } else {
          if (inSignups) {
            contestantList.push(msg.author.id);
            msg.channel.send("Great! You're in!");
            client.channels.get("381995396584570880").send(msg.author.username + " just joined! There are now " + contestantList.length + " contestants!");
          } else {
            msg.channel.send("Whoops, ya joined late. Try again later.");
          }
        }
        break;
      case "qmt$start":
        if (message.author != host) {
          message.channel.send("Hey, you aren't the host! Get out!");
          return;
        }

      case "qmt$help":
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
    }
  }
