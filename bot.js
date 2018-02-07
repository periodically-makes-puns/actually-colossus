let config = require("./config.json");
const fs = require("graceful-fs");
config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const textfile = require("textfile");
function clean(text) {
  if (typeof(text) === "string") {
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  } else {
    return text;
  }
}

module.exports = (client, message) => {
  config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  if (message.author.id != process.env.MYID) {
    message.channel.send("nice try");
    return;
  }
  let args = message.content.split(/[$ ]+/g);
  switch (args[1]) {
    case "restart":
      message.channel.send("So long, farewell!");
      message.channl.send();
      break;
    case "wipe":
      config.votescreens = [];
      config.vscreens = [];
      config.votes = [];
      config.responses = [];
      config.votecount = [];
      config.status = "none";
      textfile.write("./config.json",config, "json", (err) => {console.log(err)});
      message.channel.send("wiped");
      break;
    case "eval":
      args = message.content.split(" ").slice(1);
      try {
        const code = args.join(" ");
        let evaled = eval(code);
        console.log(evaled);
        if (typeof evaled !== "string") {
          evaled = require("util").inspect(evaled);
        }
        message.channel.send(clean(evaled), {code:"xl"});
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
      
      break;
    default:
      message.channel.send("that's not a command in BOT you bozo");
  }
}
