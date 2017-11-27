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
module.exports = (msg) => {
    argusGen = {
      "help": " [cmd]"
    }
    valuesGen = {
      "help": "Geez, I thought you knew how gen$help worked if you're flipping using it.\nBut because this is still a flipping help message, here's your damned info.\n*Gives information about gen$[cmd].*"
    }
    argdescsGen = {
      "help": "*[cmd]: A valid command in module gen.*"
    }
    if (msg.content == "gen$help") {
      msg.channel.send({embed: {
          color: 4369908,
          title: "A Guide to the Proper Use of this Automatically Functioning Robot",
          description: "Need help? Get it here.",
          fields: [
            {
              name: "Modules",
              value: "*gen (**gen**eral)\nqmt (**Q**uick **M**ini**T**WOWs)\nbgm (**B**oard **G**ame **M**odule)\nwfa (**W**ol**f**ram **A**lpha)\ndnd (**D**ungeons a**n**d **D**ragons)*"
            },
            {
              name: "gen (**gen**eral)",
              value: "*gen$help*"
            },
            {
              name: "qmt (**Q**uick **M**ini**T**WOWs) [NOT FUNCTIONING]",
              value: "*qmt$help\nqmt$queue\nqmt$join\nqmt$respond\nqmt$vote-screen\nqmt$vote*"
            },
            {
              name: "bgm (**B**oard **G**ame **M**odule)",
              value: "*nothing yet*"
            },
            {
              name: "dnd (**D**ungeons a**n**d **D**ragons)",
              value: "*nothing yet*"
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
      args = msg.content.split(/ +/g);
      console.log(args);
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
        if (votescreens.has(msg.author.id)) {
          msg.channel.send("Only one screen for you.");
          return;
        }
        let responses = ["Keep sweating. Sweat is liquid, and liquids kill fires, right?","Strangle yourself, so you'll never burn to death, just suffocate.","Dash for the nearest water source! Preferably an unpolluted one.","I'm a \"How To Escape A Fire\" book! ...Won't help."];
        placeholder = responses;
        let screenNum = Math.ceil(Math.random()*factorial(responses.length))-1;
        let screen = factbase(screenNum,responses.length-1);
        
        let text = "";
        for (i = 0; i < screen.length; i++) {
          let words11 = (placeholder[screen[i]].split(" ").length > 10) ? " ***(UH OH OVER 10 WORDS VOTE DOWN)***" : "";
          text += String.fromCharCode(65+i) + ": ";
          text += placeholder[screen[i]] + " ";
          word = (placeholder[screen[i]].split(" ").length == 1) ? " word)" : " words)";
          text += "(" + placeholder[screen[i]].split(" ").length + word + words11;
          text += "\n";
          placeholder.splice(screen[i],1);
        }
        text += String.fromCharCode(65+screen.length) + ": ";
        text += placeholder[0] + " ";
        word = (placeholder[0].split(" ").length == 1) ? " word)" : " words)";
        text += "(" + placeholder[0].split(" ").length + word;
        text += "\n";
        arr = text.split("\n");
        msg.channel.send("Screen #" + screenNum + "\n" + arr.slice(0,10).join("\n"));
        votescreens.set(msg.author.id, screenNum);
    } else if (msg.content.startsWith("gen$vote")) {
      if (msg.channel.type != "dm") {
        msg.channel.send("Keep your votes private, ya bum."); 
        return;
      }
      args = msg.content.split(/ +/g);
      try {
        if (parseInt(args[1]) != votescreens[msg.author.id]) {
          msg.channel.send("I don't recall sending you that screen. Try again?");
          return;
        }
      } catch (e) {
        msg.channel.send("I didn't even send you a single voting screen.");
        return;
      }
      
    } else if (msg.content.startsWith("gen$request")) {
        if (msg.channel.type != "dm") {
          msg.channel.send("Keep your votes private, ya bum."); 
          return;
        }
        if (votescreens.has(msg.author.id)) {
          msg.channel.send("Only one screen for you.");
          return;
        }
        args = msg.content.split(" ");
        let responses = ["Keep sweating. Sweat is liquid, and liquids kill fires, right?","Strangle yourself, so you'll never burn to death, just suffocate.","Dash for the nearest water source! Preferably an unpolluted one.","I'm a \"How To Escape A Fire\" book! ...Won't help."];
        placeholder = responses;
        let screenNum = parseInt(args[1]);
        if (screenNum >= fact(responses.length)) {
          msg.channel.send("Sorry, but that number's too large! You need a number between 0 and " + (fact(responses.length) - 1) + "!");
          return;
        }
        let screen = factbase(screenNum,responses.length-1);
        let text = "";
        for (i = 0; i < screen.length; i++) {
          let words11 = (placeholder[screen[i]].split(" ").length > 10) ? " ***(UH OH OVER 10 WORDS VOTE DOWN)***" : "";
          text += String.fromCharCode(65+i) + ": ";
          text += placeholder[screen[i]] + " ";
          word = (placeholder[screen[i]].split(" ").length == 1) ? " word)" : " words)";
          text += "(" + placeholder[screen[i]].split(" ").length + word + words11;
          text += "\n";
          placeholder.splice(screen[i],1);
        }
        text += String.fromCharCode(65+screen.length) + ": ";
        text += placeholder[0] + " ";
        word = (placeholder[0].split(" ").length == 1) ? " word)" : " words)";
        text += "(" + placeholder[0].split(" ").length + word;
        text += "\n";
        arr = text.split("\n");
        msg.channel.send("Screen #" + screenNum + "\n" + arr.slice(0,10).join("\n"));
        votescreens.set(msg.author.id, screenNum);  
    } else {
      msg.channel.send("That's not a command in gen, you know. Try gen$help.");
    }
  }
