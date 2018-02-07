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
function Profile(client, id, response, score, stdev, rank, prize, alive) {
  this.user = client.users.get(id);
  this.name = this.user.username
  this.response = response;
  this.score = score;
  this.stdev = stdev;
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
      fields: [{
          name: "Score",
          value: this.score * 100 + "%"
        },
        {
          name: "Standard Deviation",
          value: this.stdev * 100 + "%"
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
let placeholder;
let out;
let goto;
let index;
let screenName;
let vote;
let k;
let gene;
let current;
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
let names = ["A", "ABILITY", "ABLE", "ABOUT", "ABOVE", "ACCEPT", "ACCORDING", "ACCOUNT", "ACROSS", "ACT", "ACTION", "ACTIVITY", "ACTUALLY", "ADD", "ADDRESS", "ADMINISTRATION", "ADMIT", "ADULT", "AFFECT", "AFTER", "AGAIN", "AGAINST", "AGE", "AGENCY", "AGENT", "AGO", "AGREE", "AGREEMENT", "AHEAD", "AIR", "ALL", "ALLOW", "ALMOST", "ALONE", "ALONG", "ALREADY", "ALSO", "ALTHOUGH", "ALWAYS", "AMERICAN", "AMONG", "AMOUNT", "ANALYSIS", "AND", "ANIMAL", "ANOTHER", "ANSWER", "ANY", "ANYONE", "ANYTHING", "APPEAR", "APPLY", "APPROACH", "AREA", "ARGUE", "ARM", "AROUND", "ARRIVE", "ART", "ARTICLE", "ARTIST", "AS", "ASK", "ASSUME", "AT", "ATTACK", "ATTENTION", "ATTORNEY", "AUDIENCE", "AUTHOR", "AUTHORITY", "AVAILABLE", "AVOID", "AWAY", "BABY", "BACK", "BAD", "BAG", "BALL", "BANK", "BAR", "BASE", "BE", "BEAT", "BEAUTIFUL", "BECAUSE", "BECOME", "BED", "BEFORE", "BEGIN", "BEHAVIOR", "BEHIND", "BELIEVE", "BENEFIT", "BEST", "BETTER", "BETWEEN", "BEYOND", "BIG", "BILL", "BILLION", "BIT", "BLACK", "BLOOD", "BLUE", "BOARD", "BODY", "BOOK", "BORN", "BOTH", "BOX", "BOY", "BREAK", "BRING", "BROTHER", "BUDGET", "BUILD", "BUILDING", "BUSINESS", "BUT", "BUY", "BY", "CALL", "CAMERA", "CAMPAIGN", "CAN", "CANCER", "CANDIDATE", "CAPITAL", "CAR", "CARD", "CARE", "CAREER", "CARRY", "CASE", "CATCH", "CAUSE", "CELL", "CENTER", "CENTRAL", "CENTURY", "CERTAIN", "CERTAINLY", "CHAIR", "CHALLENGE", "CHANCE", "CHANGE", "CHARACTER", "CHARGE", "CHECK", "CHILD", "CHOICE", "CHOOSE", "CHURCH", "CITIZEN", "CITY", "CIVIL", "CLAIM", "CLASS", "CLEAR", "CLEARLY", "CLOSE", "COACH", "COLD", "COLLECTION", "COLLEGE", "COLOR", "COME", "COMMERCIAL", "COMMON", "COMMUNITY", "COMPANY", "COMPARE", "COMPUTER", "CONCERN", "CONDITION", "CONFERENCE", "CONGRESS", "CONSIDER", "CONSUMER", "CONTAIN", "CONTINUE", "CONTROL", "COST", "COULD", "COUNTRY", "COUPLE", "COURSE", "COURT", "COVER", "CREATE", "CRIME", "CULTURAL", "CULTURE", "CUP", "CURRENT", "CUSTOMER", "CUT", "DARK", "DATA", "DAUGHTER", "DAY", "DEAD", "DEAL", "DEATH", "DEBATE", "DECADE", "DECIDE", "DECISION", "DEEP", "DEFENSE", "DEGREE", "DEMOCRAT", "DEMOCRATIC", "DESCRIBE", "DESIGN", "DESPITE", "DETAIL", "DETERMINE", "DEVELOP", "DEVELOPMENT", "DIE", "DIFFERENCE", "DIFFERENT", "DIFFICULT", "DINNER", "DIRECTION", "DIRECTOR", "DISCOVER", "DISCUSS", "DISCUSSION", "DISEASE", "DO", "DOCTOR", "DOG", "DOOR", "DOWN", "DRAW", "DREAM", "DRIVE", "DROP", "DRUG", "DURING", "EACH", "EARLY", "EAST", "EASY", "EAT", "ECONOMIC", "ECONOMY", "EDGE", "EDUCATION", "EFFECT", "EFFORT", "EIGHT", "EITHER", "ELECTION", "ELSE", "EMPLOYEE", "END", "ENERGY", "ENJOY", "ENOUGH", "ENTER", "ENTIRE", "ENVIRONMENT", "ENVIRONMENTAL", "ESPECIALLY", "ESTABLISH", "EVEN", "EVENING", "EVENT", "EVER", "EVERY", "EVERYBODY", "EVERYONE", "EVERYTHING", "EVIDENCE", "EXACTLY", "EXAMPLE", "EXECUTIVE", "EXIST", "EXPECT", "EXPERIENCE", "EXPERT", "EXPLAIN", "EYE", "FACE", "FACT", "FACTOR", "FAIL", "FALL", "FAMILY", "FAR", "FAST", "FATHER", "FEAR", "FEDERAL", "FEEL", "FEELING", "FEW", "FIELD", "FIGHT", "FIGURE", "FILL", "FILM", "FINAL", "FINALLY", "FINANCIAL", "FIND", "FINE", "FINGER", "FINISH", "FIRE", "FIRM", "FIRST", "FISH", "FIVE", "FLOOR", "FLY", "FOCUS", "FOLLOW", "FOOD", "FOOT", "FOR", "FORCE", "FOREIGN", "FORGET", "FORM", "FORMER", "FORWARD", "FOUR", "FREE", "FRIEND", "FROM", "FRONT", "FULL", "FUND", "FUTURE", "GAME", "GARDEN", "GAS", "GENERAL", "GENERATION", "GET", "GIRL", "GIVE", "GLASS", "GO", "GOAL", "GOOD", "GOVERNMENT", "GREAT", "GREEN", "GROUND", "GROUP", "GROW", "GROWTH", "GUESS", "GUN", "GUY", "HAIR", "HALF", "HAND", "HANG", "HAPPEN", "HAPPY", "HARD", "HAVE", "HE", "HEAD", "HEALTH", "HEAR", "HEART", "HEAT", "HEAVY", "HELP", "HER", "HERE", "HERSELF", "HIGH", "HIM", "HIMSELF", "HIS", "HISTORY", "HIT", "HOLD", "HOME", "HOPE", "HOSPITAL", "HOT", "HOTEL", "HOUR", "HOUSE", "HOW", "HOWEVER", "HUGE", "HUMAN", "HUNDRED", "HUSBAND", "I", "IDEA", "IDENTIFY", "IF", "IMAGE", "IMAGINE", "IMPACT", "IMPORTANT", "IMPROVE", "IN", "INCLUDE", "INCLUDING", "INCREASE", "INDEED", "INDICATE", "INDIVIDUAL", "INDUSTRY", "INFORMATION", "INSIDE", "INSTEAD", "INSTITUTION", "INTEREST", "INTERESTING", "INTERNATIONAL", "INTERVIEW", "INTO", "INVESTMENT", "INVOLVE", "ISSUE", "IT", "ITEM", "ITS", "ITSELF", "JOB", "JOIN", "JUST", "KEEP", "KEY", "KID", "KILL", "KIND", "KITCHEN", "KNOW", "KNOWLEDGE", "LAND", "LANGUAGE", "LARGE", "LAST", "LATE", "LATER", "LAUGH", "LAW", "LAWYER", "LAY", "LEAD", "LEADER", "LEARN", "LEAST", "LEAVE", "LEFT", "LEG", "LEGAL", "LESS", "LET", "LETTER", "LEVEL", "LIE", "LIFE", "LIGHT", "LIKE", "LIKELY", "LINE", "LIST", "LISTEN", "LITTLE", "LIVE", "LOCAL", "LONG", "LOOK", "LOSE", "LOSS", "LOT", "LOVE", "LOW", "MACHINE", "MAGAZINE", "MAIN", "MAINTAIN", "MAJOR", "MAJORITY", "MAKE", "MAN", "MANAGE", "MANAGEMENT", "MANAGER", "MANY", "MARKET", "MARRIAGE", "MATERIAL", "MATTER", "MAY", "MAYBE", "ME", "MEAN", "MEASURE", "MEDIA", "MEDICAL", "MEET", "MEETING", "MEMBER", "MEMORY", "MENTION", "MESSAGE", "METHOD", "MIDDLE", "MIGHT", "MILITARY", "MILLION", "MIND", "MINUTE", "MISS", "MISSION", "MODEL", "MODERN", "MOMENT", "MONEY", "MONTH", "MORE", "MORNING", "MOST", "MOTHER", "MOUTH", "MOVE", "MOVEMENT", "MOVIE", "MR", "MRS", "MUCH", "MUSIC", "MUST", "MY", "MYSELF", "NAME", "NATION", "NATIONAL", "NATURAL", "NATURE", "NEAR", "NEARLY", "NECESSARY", "NEED", "NETWORK", "NEVER", "NEW", "NEWS", "NEWSPAPER", "NEXT", "NICE", "NIGHT", "NO", "NONE", "NOR", "NORTH", "NOT", "NOTE", "NOTHING", "NOTICE", "NOW", "N'T", "NUMBER", "OCCUR", "OF", "OFF", "OFFER", "OFFICE", "OFFICER", "OFFICIAL", "OFTEN", "OH", "OIL", "OK", "OLD", "ON", "ONCE", "ONE", "ONLY", "ONTO", "OPEN", "OPERATION", "OPPORTUNITY", "OPTION", "OR", "ORDER", "ORGANIZATION", "OTHER", "OTHERS", "OUR", "OUT", "OUTSIDE", "OVER", "OWN", "OWNER", "PAGE", "PAIN", "PAINTING", "PAPER", "PARENT", "PART", "PARTICIPANT", "PARTICULAR", "PARTICULARLY", "PARTNER", "PARTY", "PASS", "PAST", "PATIENT", "PATTERN", "PAY", "PEACE", "PEOPLE", "PER", "PERFORM", "PERFORMANCE", "PERHAPS", "PERIOD", "PERSON", "PERSONAL", "PHONE", "PHYSICAL", "PICK", "PICTURE", "PIECE", "PLACE", "PLAN", "PLANT", "PLAY", "PLAYER", "PM", "POINT", "POLICE", "POLICY", "POLITICAL", "POLITICS", "POOR", "POPULAR", "POPULATION", "POSITION", "POSITIVE", "POSSIBLE", "POWER", "PRACTICE", "PREPARE", "PRESENT", "PRESIDENT", "PRESSURE", "PRETTY", "PREVENT", "PRICE", "PRIVATE", "PROBABLY", "PROBLEM", "PROCESS", "PRODUCE", "PRODUCT", "PRODUCTION", "PROFESSIONAL", "PROFESSOR", "PROGRAM", "PROJECT", "PROPERTY", "PROTECT", "PROVE", "PROVIDE", "PUBLIC", "PULL", "PURPOSE", "PUSH", "PUT", "QUALITY", "QUESTION", "QUICKLY", "QUITE", "RACE", "RADIO", "RAISE", "RANGE", "RATE", "RATHER", "REACH", "READ", "READY", "REAL", "REALITY", "REALIZE", "REALLY", "REASON", "RECEIVE", "RECENT", "RECENTLY", "RECOGNIZE", "RECORD", "RED", "REDUCE", "REFLECT", "REGION", "RELATE", "RELATIONSHIP", "RELIGIOUS", "REMAIN", "REMEMBER", "REMOVE", "REPORT", "REPRESENT", "REPUBLICAN", "REQUIRE", "RESEARCH", "RESOURCE", "RESPOND", "RESPONSE", "RESPONSIBILITY", "REST", "RESULT", "RETURN", "REVEAL", "RICH", "RIGHT", "RISE", "RISK", "ROAD", "ROCK", "ROLE", "ROOM", "RULE", "RUN", "SAFE", "SAME", "SAVE", "SAY", "SCENE", "SCHOOL", "SCIENCE", "SCIENTIST", "SCORE", "SEA", "SEASON", "SEAT", "SECOND", "SECTION", "SECURITY", "SEE", "SEEK", "SEEM", "SELL", "SEND", "SENIOR", "SENSE", "SERIES", "SERIOUS", "SERVE", "SERVICE", "SET", "SEVEN", "SEVERAL", "SHAKE", "SHARE", "SHE", "SHOOT", "SHORT", "SHOT", "SHOULD", "SHOULDER", "SHOW", "SIDE", "SIGN", "SIGNIFICANT", "SIMILAR", "SIMPLE", "SIMPLY", "SINCE", "SING", "SINGLE", "SISTER", "SIT", "SITE", "SITUATION", "SIX", "SIZE", "SKILL", "SKIN", "SMALL", "SMILE", "SO", "SOCIAL", "SOCIETY", "SOLDIER", "SOME", "SOMEBODY", "SOMEONE", "SOMETHING", "SOMETIMES", "SON", "SONG", "SOON", "SORT", "SOUND", "SOURCE", "SOUTH", "SOUTHERN", "SPACE", "SPEAK", "SPECIAL", "SPECIFIC", "SPEECH", "SPEND", "SPORT", "SPRING", "STAFF", "STAGE", "STAND", "STANDARD", "STAR", "START", "STATE", "STATEMENT", "STATION", "STAY", "STEP", "STILL", "STOCK", "STOP", "STORE", "STORY", "STRATEGY", "STREET", "STRONG", "STRUCTURE", "STUDENT", "STUDY", "STUFF", "STYLE", "SUBJECT", "SUCCESS", "SUCCESSFUL", "SUCH", "SUDDENLY", "SUFFER", "SUGGEST", "SUMMER", "SUPPORT", "SURE", "SURFACE", "SYSTEM", "TABLE", "TAKE", "TALK", "TASK", "TAX", "TEACH", "TEACHER", "TEAM", "TECHNOLOGY", "TELEVISION", "TELL", "TEN", "TEND", "TERM", "TEST", "THAN", "THANK", "THAT", "THE", "THEIR", "THEM", "THEMSELVES", "THEN", "THEORY", "THERE", "THESE", "THEY", "THING", "THINK", "THIRD", "THIS", "THOSE", "THOUGH", "THOUGHT", "THOUSAND", "THREAT", "THREE", "THROUGH", "THROUGHOUT", "THROW", "THUS", "TIME", "TO", "TODAY", "TOGETHER", "TONIGHT", "TOO", "TOP", "TOTAL", "TOUGH", "TOWARD", "TOWN", "TRADE", "TRADITIONAL", "TRAINING", "TRAVEL", "TREAT", "TREATMENT", "TREE", "TRIAL", "TRIP", "TROUBLE", "TRUE", "TRUTH", "TRY", "TURN", "TV", "TWO", "TYPE", "UNDER", "UNDERSTAND", "UNIT", "UNTIL", "UP", "UPON", "US", "USE", "USUALLY", "VALUE", "VARIOUS", "VERY", "VICTIM", "VIEW", "VIOLENCE", "VISIT", "VOICE", "VOTE", "WAIT", "WALK", "WALL", "WANT", "WAR", "WATCH", "WATER", "WAY", "WE", "WEAPON", "WEAR", "WEEK", "WEIGHT", "WELL", "WEST", "WESTERN", "WHAT", "WHATEVER", "WHEN", "WHERE", "WHETHER", "WHICH", "WHILE", "WHITE", "WHO", "WHOLE", "WHOM", "WHOSE", "WHY", "WIDE", "WIFE", "WILL", "WIN", "WIND", "WINDOW", "WISH", "WITH", "WITHIN", "WITHOUT", "WOMAN", "WONDER", "WORD", "WORK", "WORKER", "WORLD", "WORRY", "WOULD", "WRITE", "WRITER", "WRONG", "YARD", "YEAH", "YEAR", "YES", "YET", "YOU", "YOUNG", "YOUR", "YOURSELF"];
let responses = ["When my currency conversion was calculated, I rigged the calculator.", "Someone gave me a ticket for no reason... and extra.", "I may or may not've used all my life savings...", "We’re in Zimbabwe! A foreign American bill transferred is 900,000,000,000,000,000!", "I used a simple trick I learnt from pop-up ads!", "I sold off my relatives, I wish'em luck as slaves!", "Money MakerTM! It prints out all the money you need!", "Take advantage of foreigners, \"help\" them buy a train ticket!", "Swindling my compatriots, I offered \"financial advice\", purchasable with credits.", "I started a rigged underground gambling ring, embezzling every profit.", "Years of loose change collecting, between cracks, in drains, everywhere.", "Legitimately. As in, not bribery... It was EZI! Er, easy.", "Investment from my late parents. 55 years down the drain.", "People gave money thinking my clumsiness was a severe disorder.", "I don't need a ticket, I'm the driver, after all.", "Work for the money, income is one way to pay!", "A couple millenia of slavery. Only! It pays really well.", "Oh, I only plagiarized a *couple* hundred responses. Nothing special.", "I found it. A nearby note said: “Please; take **IT**.”", "Gluing nine credit bills together fooled the greedy ticket salesmen.", "Betting at local casinos against my friends. *They're so gullible.*", "Simple. Counterfeit money isn't illegal where I am. *Copy paste*", "Anybody remember how 35 credits went missing from the bank?", "My local currency was on printer paper. Forgery was straightforward!", "Work minimum wage, everyone's salaries are counted in billions anyways."];
function avg(arr) {
  return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0)/arr.length;
}
function stdev(arr) {
  let avg = avg(arr);
  return Math.sqrt(arr.reduce((accumulator, currentValue) => accumulator + (avg-currentValue)*(avg-currentValue), 0)/(arr.length-1));
}
let config = require("./config.json");
const fs = require("graceful-fs");
config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const Interval = require("Interval");
const textfile = require("textfile");
const res = require("./results.js");
let test;
module.exports = (client,msg) => {
    if (msg.content == "gen$test") {
      test = new Profile(client, process.env.MYID, "no u", 0.3050, 0.2050, 10, false, true);
      msg.channel.send(test.embed);
    }
    config = require("./config.json");
    if (msg.content == "gen$help") {
      msg.channel.send({embed: {
          color: 4369908,
          title: "A Guide to the Proper Use of this Automatically Functioning Robot",
          description: "Need help? Get it here.",
          fields: [
            {
              name: "Modules",
              value: "gen (**gen**eral)\nqmt"
            },
            {
              name: "gen (**gen**eral)",
              value: "*gen$help\ngen$vote-screen*"
            },
            {
              name: "qmt (**Q**uick **M**ini**T**WOWs) [NOT FUNCTIONING]",
              value: "*qmt$help\nqmt$queue\nqmt$join\nqmt$respond\nqmt$vote-screen\nqmt$vote\nqmt$start\nqmt$prompt*"
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
      } else if (config.status != "voting") {
        msg.channel.send("not givin' out voting screens right now");
        return;
      }
      let ind = config.votescreens.findIndex(function(currentValue) {return (currentValue[0] == msg.author.id)});
      let indi = config.responses.findIndex(function (currentValue) { return (currentValue[0] == msg.author.id)});
      let ct = config.votecount.findIndex(function (currentValue) { return (currentValue[0] == msg.author.id)});
      if (ct == -1) {
        config.votecount.push([msg.author.id, 0]);
      }
      if (ind == -1) {
        config.votescreens.push([msg.author.id]);
      }
      ind = config.votescreens.findIndex(function(currentValue) {return (currentValue[0] == msg.author.id)});
      ct = config.votecount.findIndex(function (currentValue) { return (currentValue[0] == msg.author.id)});
      if (config.votescreens[ind].length-1 > config.votecount[ct][1]) {
        msg.channel.send("You have at least one outstanding screen.");
        return;
      }
      let placeholder = [];
      console.log(config.responses);
      for (let i = 0; i < config.responses.length; i++) {
        placeholder.push(config.responses[i][1]);
      }
      let count = config.responses.length;
      goto = [];
      index = Math.floor(Math.random()*names.length);
      screenName = names[index]; 
      out = "Screen " + screenName + ":\n";
      let own = (indi != -1) && (config.votecount[ct][1] % 3 == 2);
      let n = indi;
      if (own) {
        out += String.fromCharCode(65) + ": ";
        out += placeholder[n];
        goto.push(placeholder[n]);
        k = placeholder[n].split(/\s+/g).length.toString();
        out += (" **(" + k + ((k == "1") ? " word)**\n" : " words)**\n") + ((parseInt(k) > 10) ? " ***OVER TEN WORDS VOTE DOWN***\n" : ""));
      }
      console.log(placeholder);
      if (indi != -1) {
        placeholder.splice(n,1);
      }
      let d = (own) ? 1 : 0
      for (let i = 0 + d; i < 5; i++) {
        n = Math.floor(Math.random()*placeholder.length);
        console.log(n);
        out += String.fromCharCode(65+i) + ": ";
        out += placeholder[n];
        goto.push(placeholder[n]);
        k = placeholder[n].split(/\s+/g).length.toString();
        out += (" **(" + k + ((k == "1") ? " word)**\n" : " words)**\n") + ((parseInt(k) > 10) ? " ***OVER TEN WORDS VOTE DOWN***\n" : ""));
        placeholder.splice(n,1);
      }
      
      msg.channel.send(out);
      names.splice(index,1);
      msg.channel.send("Vote with gen$vote [screenName] [vote] to me!");
      config.vscreens.push([screenName].concat(goto));
      config.votescreens[ind].push(screenName);
      client.users.get("248953835899322370").send(msg.author.username + " just requested screen " + screenName);
      textfile.write("./config.json",config, "json", (err) => {console.log(err)});
    } else if (msg.content.startsWith("gen$vote")) {
      if (msg.channel.type != "dm") {
        msg.channel.send("Keep your votes private, ya bum."); 
        return;
      } else if (config.status != "voting") {
        msg.channel.send("not givin' out voting screens right now");
        return;
      }
      let args = msg.content.split(/ +/g);
      if (args.length != 3) {
        msg.channel.send("Uhoh! You're either missing something or added too many arguments. If you're confused, ask PMP#5728 for help!");
        return;
      }
      let len = Math.min(5,config.responses.length);
      let fil = config.votescreens.find(function(currentValue) {return (currentValue[0] == msg.author.id)})
      if (fil == undefined) {
        msg.channel.send("I never sent you a single voting screen. Come on.");
        client.users.get("248953835899322370").send(msg.author.username + " tried to vote on a voting screen called " + args[1] + ", but they never received one!");
        return;
      } else if (fil.indexOf(args[1]) == -1) {
        msg.channel.send("I didn't send you that voting screen. Are you sure you didn't make any spelling errors?");
        client.users.get("248953835899322370").send(msg.author.username + " tried to vote on a voting screen they didn't receive, called " + args[1] + ".");
      }
      vote = [];
      for (let i = 0; i < args[2].length; i++) {
        if (args[2].charCodeAt(i) > 65 + len - 1 || args[2].charCodeAt(i) < 65) {
          msg.channel.send("Invalid character detected!\nAre you sure you used only capital letters in your vote?");
          client.users.get("248953835899322370").send(msg.author.username + " used invalid characters in their vote on " + args[1] + ".");
          return;
        } else if (vote.indexOf(args[2].charAt(i)) != -1) {
          msg.channel.send("A repeat letter has been found! Please correct your vote to remove the repetition.");
          client.users.get("248953835899322370").send(msg.author.username + " used repeated characters in their vote on " + args[1] + ".");
          return;
        }
        vote.push(args[2].charAt(i));
      }
      if ((args[2] == "ABCDE") || (args[2] == "BACDE") || (args[2] == "CABDE") || (args[2] == "DABCE") || (args[2] == "EABCD")) {
        msg.channel.send("hey please don't alphabet vote. if this is actually legit, dm PMP a screenshot of the screen and vote and he'll handle it");
        return;
      }
      let responses = [];
      for (let i = 0; i < config.responses.length; i++) {
        responses.push(config.responses[i][1]);
      }
      out = [args[1]];
      out.push(msg.author.id);
      for (let i = 0; i < config.responses.length; i++) {
        out.push(-1);
      }
      let thisscreen = config.vscreens.find(function (currentValue) {return (currentValue[0] == args[1])});
      let index = config.votes.findIndex(function (currentValue) {return currentValue[0] == thisscreen[0]});
      let cnt = config.votecount.findIndex(function (currentValue) { return (currentValue[0] == msg.author.id)});
      if (cnt == -1) {
        config.votecount.push([msg.author.id, 0]);
      }
      cnt = config.votecount.findIndex(function (currentValue) { return (currentValue[0] == msg.author.id)});
      if (index != -1) {
        config.votes.splice(index,1);
        config.votecount[cnt][1]--;
      }
      console.log(out);
      let omit = (len - vote.length);
      if (omit > 1) {
        msg.channel.send("Please vote on all of the responses.");
        return;
      }
      let omitscore = (omit - 1) / 2 / (len-1);
      console.log(thisscreen);
      for (let i = 2; i < len+2; i++) {
        if (vote.indexOf(String.fromCharCode(63+i)) == -1) {
          out[responses.indexOf(thisscreen[i-1])+2] = omitscore;
          continue;
        }
        out[responses.indexOf(thisscreen[i-1])+2] = (len-vote.indexOf(String.fromCharCode(63+i))-1)/(len-1);
      }
      config.votes.push(out);
      config.votecount[cnt][1]++;
      msg.channel.send("Your vote on " + args[1] + " of " + args[2] + " has been recorded. Have a good day.");
      client.users.get("248953835899322370").send(msg.author.username + " voted with the following array: [" + out.join(", ") + "]" + "\n The vote was: " + args[1] + " " + args[2] + ".");
      textfile.write("./config.json",config, "json", (err) => {console.log(err)});
    } else if (msg.content.startsWith("gen$respond")) {
      console.log(config.status);
      if (msg.channel.type != "dm") {
        msg.channel.send("Keep your response private, you bozo");
        return;
      } else if (config.status != "responding") {
        msg.channel.send("Not accepting responses right now.");
        return;
      } else if (!client.guilds.get("358734891850137630").roles.get("359506715953070082").members.has(msg.author.id)) {
        msg.channel.send("Whoa there, you aren't a contestant!");
        return;
      }
      let al = config.responses.findIndex(function(value) {return value[0] == msg.author.id});
      let response = msg.content.split(/\s+/g);
      let leng = response.length - 1;
      response.splice(0,1);
      client.guilds.get("358734891850137630").member(msg.author).addRole("362937543823589376");
      client.guilds.get("358734891850137630").member(msg.author).removeRole("362936959129354260");
      msg.channel.send("Your response is now: " + response.join(" ") + "\n\nWord count: " + leng + ((leng > 10) ? "\n**Your response exceeds the word limit.**" : "\n"));
      if (al == -1) {
        config.responses.push([msg.author.id, response.join(" ")]);
      } else {
        msg.channel.send("Your old response was: " + config.responses[al][1]);
        config.responses[al] = [msg.author.id, response.join(" ")];
      }
      textfile.write("./config.json",config, "json", (err) => {console.log(err)});
      config = require('./config.json');
      al = config.responses.findIndex(function(value) {return value[0] == msg.author.id});
      client.users.get(process.env.MYID).send(msg.author.username + " responded with: \n\n" + config.responses[al][1]);
    } else if (msg.content.startsWith("gen$set-status")) {
      if (msg.author.id != process.env.MYID) {
        msg.channel.send("nice try");
        return;
      }
      config.status = msg.content.split(/\s+/g)[1];
      textfile.write("./config.json",config, "json", (err) => {console.log(err)});
      config = require("./config.json");
      gene = client.guilds.get("358734891850137630").members.keys();
      if (config.status == "responding") {
        Interval.run(function() {
          current = gene.next();
          if (client.guilds.get("358734891850137630").roles.get("359506715953070082").members.has(current.value)) {
            client.guilds.get("358734891850137630").member(client.users.get(current.value)).addRole("362936959129354260");
          }
        },1000).until(function () {
          return current.done;
        }).end(function () {
          msg.channel.send("role assignment finished");
        });
      }
      msg.channel.send("status set to " + msg.content.split(/\s+/g)[1]);
    } else if (msg.content.startsWith("gen$remind")) {
      if (msg.author.id != process.env.MYID) {
        msg.channel.send("nice try");
      }
      gene = client.guilds.get("358734891850137630").members.keys();
      if (config.status == "responding") {
        Interval.run(function() {
          current = gene.next();
          if (client.guilds.get("358734891850137630").roles.get("362936959129354260").members.has(current.value)) {
            client.users.get(current.value).send("Hey, you have yet to respond to the current prompt: **How do you avoid the disease in Arstotzka?** You have approximately 9 hours to do so.");
          }
        },10000).until(function () {
          return current.done;
        }).end(function () {
          msg.channel.send("reminding finished");
        });
      }
    } else if (msg.content.startsWith("gen$check")) {
      if (msg.author.id != process.env.MYID) {
        msg.channel.send("nice try");
        return;
      }
      let ids = [];
      let responses = [];
      let votes = [];
      
      for (let i = 0; i < config.responses.length; i++) {
        ids.push(config.responses[i][0]);
        responses.push(config.responses[i][1]);
      }
      for (let i = 0; i < config.votes.length; i++) {
        votes.push(config.votes[i]);
      }
      res(client, msg, ids, responses, votes);
    } else {
      msg.channel.send("That's not a command in gen, you know. Try gen$help.");
    }
  }
