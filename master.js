const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

const gen = require("./gen.js");
const qmt = require("./qmt.js");
const puz = require("./puz.js");
client.on("ready", () => {
  console.log("I was always ready.");
});
client.on("message", (message) => {
  if (message.channel.id == "382630363287257088" && message.content.split("discord.gg").length >= 2) {
    message.channel.send("FILTHY CAPITALIST");
    return;
  }
  if (message.author.bot) {return};
  if (parseFloat(message.content) != NaN) {
    if (Math.random() < 0.01) {
      message.channel.send("That's Numberwang!");
    } else if (Math.random() < 0.0001) {
      message.channel.send("That's Wangernumb!");
      message.channel.send(message.author + ", you are today's Numberwang.");
      message.channel.send("Come back tomorrow for more Numberwang!");
    }
  } else {
    if (message.content.split(" ").length == 1 && Math.random() < 0.0001) {
      message.channel.send("I'm sorry, but " + message.content + " is a real number, as in the popular phrase, I only have " + message.content + " cookies left in the jar.");
    }
  }
  if (message.channel.id != "359448610691350529" && message.channel.id != "380454181879939073" && message.channel.id != "381995396584570880" && message.channel.type != "dm") {
    return;
  }
  if (message.content[3] != "$") {return};
  switch (message.content.substring(0,3)) {
    case "gen":
      gen(message);
      break;
    case "qmt":
      qmt(client,message);
      break;
    case "puz":
      message.channel.send("Oh, so you want a puzzle?");
      puz(client,message);
      break;
    case "die":
      if (message.author.id != "248953835899322370") {message.channel.send("nice try"); return};
      message.channel.send("So long, farewell!");
      to-kill-the-bot(gnight-yall);
      break;
    default:
      message.channel.send(message.content.substring(0,3) + " is not a valid module. The current modules are: gen (**gen**eral), qmt (**Q**uick **M**ini**T**WOWs), and puz (**puz**zles).");
  }
});

client.login(config.token);
