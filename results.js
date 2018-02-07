function Profile(client, id, response, score, stdev, rank, prize, alive) {
  this.user = client.users.get(id);
  console.log(this.user);
  this.name = this.user.username
  this.response = response;
  this.score = Math.floor(score * 10000)/100;
  this.stdev = Math.floor(stdev * 10000)/100;
  this.pay = Math.floor((score * 70 + stdev * 10)*10000)/100;
  this.rank = rank;
  this.prize = prize;
  this.alive = alive;
  this.ordinal = "th";
  switch (rank % 10) {
    case 1:
      this.ordinal = "st";
      break;
    case 2:
      this.ordinal = "nd";
      break;
    case 3:
      this.ordinal = "rd";
      break;
  }
  if ((rank % 100 < 14) && (rank%100 > 10)) {
    this.ordinal = "th";
  }
  this.embed = {embed: 
    {
      color: 4369908,
      author: {
        name: this.user.username,
        icon_url: this.user.avatarURL
      },
      title: this.name,
      description: this.rank + this.ordinal + " place",
      fields: [{name: "Response", value: this.response},{
          name: "Score",
          value: this.score + "%"
        },
        {
          name: "Standard Deviation",
          value: this.stdev + "%"
        },
        {
          name: "Payment",
          value: "$" + this.pay / 100
        }
      ],
      timestamp: new Date(),
      footer: {
        iconURL: client.user.avatarURL,
        text: (this.prize) ? "They'll receive a prize this round!" : ((this.alive) ? "They'll continue on to the next round." : "They're dead. RIP.")
      }
    }
  }
}
let resp;
let indice;
let scores = [];
let stdevs = [];
let second = [];
function wsum(array, weights) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += (array[i] >= 0) ? array[i]*weights[i] : 0;
  }
  return sum;
}
function waverage(array, weights) {
  let sum = wsum(array, weights);
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    count += (array[i] >= 0) ? weights[i] : 0;
  }
  return sum/count;
}
function wstdev(array, weights) {
  let avg = waverage(array, weights);
  let a = 0;
  let count = 0;
  for (let i = 0; i < array.length; i++ ){
    a += (array[i] >= 0) ? ((Math.pow(Math.abs(avg-a),2)) * weights[i]) : 0;
    count += (array[i] >= 0) ? weights[i] : 0;
  }
  return Math.sqrt(a/count);
}
let weights = [];
let fs = require("graceful-fs");
let config = require("./config.json");
config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
let Interval = require("Interval");
module.exports = (client, msg, ids, responses, votes) => {
  // weight votes

  for (let i = 0; i < votes.length; i++) {
    indice = config.votecount.findIndex(function (currentValue) {return currentValue[0] == votes[i][1]});
    resp = responses.findIndex(function(currentValue) {return currentValue[0] == votes[i][1]});
    if (resp != -1) {
      if (second.indexOf(votes[i][1]) == -1) {
        second.push(votes[i][1]);
        weights.push(1);
      } else {
        weights.push(1/config.votecount[indice][1]);
      }
    } else {
      console.log(indice);
      weights.push(2/config.votecount[indice][1]);
    }
  }
  // calculate weighted mean
  let votescores = [];
  for (let i = 0; i < responses.length; i++) {
    votescores = [];
    for (let j = 0; j < weights.length; j++) {
      votescores.push(votes[j][i+2]);
    }
    scores[i] = waverage(votescores, weights);
  }
  // calculate weighted stdev
  for (let i = 0; i < responses.length; i++) {
    votescores = [];
    for (let j = 0; j < weights.length; j++) {
      votescores.push(votes[j][i+2]);
    }
    stdevs[i] = wstdev(votescores, weights);
  }
  let ranks = [];
  // find ranks
  for (let i = 0; i < scores.length; i++) {
    let count = 1;
    for (let j = 0; j < scores.length; j++) {
      if (scores[j] > scores[i]) {
        count++;
      } else if (scores[j] == scores[i] && stdevs[j] < stdevs[i]) {
        count++;
      }
    }
    ranks.push(count);
  }
  // create ResultProfiles™
  let profiles = [];
  for (let i = 0; i < responses.length; i++) {
    profiles.push(0);
  }
  for (let i = 0; i < responses.length; i++) {
    let rank = ranks[i] - 1;
    do {
      if (profiles[rank] == 0) {
        profiles[rank] = new Profile(client, ids[i], responses[i], scores[i], stdevs[i], ranks[i], false, true);
        break;
      } else {
        rank++;
      }
    } while (profiles[rank] != 0) 
  }
  let i = 0;
  Interval.run(function() {
    msg.channel.send(profiles[i].embed);
    i++;
  }, 5000).until(function(){
    return i == profiles.length;
  }).end(function(){
    msg.channel.send("That's all!");
  });
}
