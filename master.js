var express = require('express');
var app = express();
const http = require('http');
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
const Discord = require("discord.js");
const client = new Discord.Client();
const gen = require("./gen.js");
const qmt = require("./qmt.js");
const cnt = require("./cnt.js");
const bot = require("./bot.js");
let config = require("./config.json");
client.on("ready", () => {
  console.log("I was always ready.");
});
client.on("message", (message) => {
  if (message.channel.id == "382630363287257088" && message.content.split("discord.gg").length >= 2) {
    message.channel.send("FILTHY CAPITALIST");
    console.log(message.author.username + " just advertised. Screw them.");
    return;
  }
  if (message.author.bot) {return};
  if (message.content[3] != "$") {return};
  console.log(message.author.username + " tried to do " + message.content);
  switch (message.content.substring(0,3)) {
    case "gen":
      try {
        gen(client, message);
      } catch (e) {
        message.channel.send("Error detected. Error has been logged. Continue with your life.");
        console.error(e);
      }
      break;
    case "bot":
      bot(client, message);
      break;
    default:
      message.channel.send(message.content.substring(0,3) + " is not a valid module. The current modules are: gen (**gen**eral), qmt (**Q**uick **M**ini**T**WOWs), and puz (**puz**zles).");
  }
});
client.on("GuildMemberAdd", (member) => {
  client.channels.get("396689970259165184").send(member.username + " joined. Would an online border inspector please process the entrant.");
});
client.on("GuildMemberRemove", (member) => {
  client.channels.get("396689970259165184").send(member.username + " has covertly left the server, under cover of darkness. They will not be missed.");
});
client.login(process.env.TOKEN);
