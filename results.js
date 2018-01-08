let weights = new Map();
let weightedVotes = [];
let resultProfiles = [];
let avgs = [];
let stdevs = [];
let placements = [];
let avg = (input_array) => {
  return input_array.reduce(function (accumulator, currentValue) {return accumulator + currentValue})/input_array.length;
}
let stdev = (input_array) => {
  let average = avg(input_array);
  return Math.sqrt(input_array.reduce(function(accumulator, currentValue) {return accumulator + Math.pow(currentValue - average, 2)})/(input_array.length-1));
}
let lcm = (input_array) => {
  let out = input_array;
  if (toString.call(out) !== "[object Array]") { 
    return  false;
  }
  let r1 = 0;
  let r2 = 0;
  var l = out.length;
  for (let i = 0; i < l; i++) {
    r1 = out[i] % out[i + 1];
    if (r1 === 0) {
      out[i+1] = (out[i] * out[i+1]) / out[i+1];
    } else {
      r2 = out[i + 1] % r1;
      if (r2 === 0) {
        out[i+1] = (out[i] * out[i+1]) / r1;
      } else {
        out[i+1] = (out[i] * out[i+1]) / r2;
      }
    }
  }
  return out[l - 1];
}
let voteArr = [];
let thingsToSay = [];
module.exports = (client, channelID, contestantList, responses, votes, prompt) => {
  let l = contestantList.length;
  // populate weights
  // client: Client
  // channelID: Snowflake
  // contestantList: Array
  // responses: Map
  // votes: Map
  for (let i = 0; i < votes.length; i++) {
    if (weights.has(votes[i][0])) {
      weights.set(votes[i][0], weights.get(votes[i][0]) + 1);
    } else {
      weights.set(votes[i][0], 1);
    }
  }
  let lcm = lcm(weights.valuelist);
  for (let i = 0; i < votes.length; i++) {
    for (let j = 0; j < lcm / weights.get(votes[i][0]); j++) {
      weightedVotes.push(votes[i]);
    }
  }
  for (let i = 0; i < l; i++) {
    resultProfiles.push([])
    voteArr = [];
    for (let j = 0; j < weightedVotes.length; j++) {
      if (weightedVotes[j][i+1] == -1) {
        continue;
      }
      voteArr.push(weightedVotes[j][i+1]);
    }
    avgs.push(avg(voteArr));
    stdevs.push(stdev(voteArr));
  }
  for (let i = 0; i < l; i++) {
    placements.push(1);
    for (let j = 0; j < l; j++) {
      if (avgs[i] < avgs[j]) {
        placements[i]++;
      } else if (avgs[i] == avgs[j] && stdevs[i] < stdevs[j]) {
        placements[i]++;
      }
    }
    resultProfiles.push([placements[i], responses[contestantList[i]], contestantList[i],avgs[i],stdevs[i]]);
  }
  resultProfiles = resultProfiles.sort(function (a, b){return a[0] - b[0]});
  client.channels.get(channelID).send("And now, for results!");
  thingsToSay = ["Good luck to all you " + l + " competitors!", "And now, let's announce the winner for the prompt: " + prompt, "They won with a score of " + resultProfiles[0][4] + ", and an stdev of " + resultProfiles[0][5] + "."];
  let i = 0;
  i = 0;
  let firstPeople = resultProfiles.findIndex(function(element, index, array) {return element > 1});
  if (firstPeople != 0) {
    thingsToSay.push("But wait! " + firstPeople + "others also got the same exact score and stdev! Wow!");
  }
  thingsToSay.push("Let's see who this first placer(s) were!");
  
  
}