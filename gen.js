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
let votescreens = [];
let vscreens = [];
let weights = new Map();
let votes = [];
let placeholder;
let out;
let goto;
let index;
let screenName;
let vote;
let k;
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
let names = ["A", "ABILITY", "ABLE", "ABOUT", "ABOVE", "ACCEPT", "ACCORDING", "ACCOUNT", "ACROSS", "ACT", "ACTION", "ACTIVITY", "ACTUALLY", "ADD", "ADDRESS", "ADMINISTRATION", "ADMIT", "ADULT", "AFFECT", "AFTER", "AGAIN", "AGAINST", "AGE", "AGENCY", "AGENT", "AGO", "AGREE", "AGREEMENT", "AHEAD", "AIR", "ALL", "ALLOW", "ALMOST", "ALONE", "ALONG", "ALREADY", "ALSO", "ALTHOUGH", "ALWAYS", "AMERICAN", "AMONG", "AMOUNT", "ANALYSIS", "AND", "ANIMAL", "ANOTHER", "ANSWER", "ANY", "ANYONE", "ANYTHING", "APPEAR", "APPLY", "APPROACH", "AREA", "ARGUE", "ARM", "AROUND", "ARRIVE", "ART", "ARTICLE", "ARTIST", "AS", "ASK", "ASSUME", "AT", "ATTACK", "ATTENTION", "ATTORNEY", "AUDIENCE", "AUTHOR", "AUTHORITY", "AVAILABLE", "AVOID", "AWAY", "BABY", "BACK", "BAD", "BAG", "BALL", "BANK", "BAR", "BASE", "BE", "BEAT", "BEAUTIFUL", "BECAUSE", "BECOME", "BED", "BEFORE", "BEGIN", "BEHAVIOR", "BEHIND", "BELIEVE", "BENEFIT", "BEST", "BETTER", "BETWEEN", "BEYOND", "BIG", "BILL", "BILLION", "BIT", "BLACK", "BLOOD", "BLUE", "BOARD", "BODY", "BOOK", "BORN", "BOTH", "BOX", "BOY", "BREAK", "BRING", "BROTHER", "BUDGET", "BUILD", "BUILDING", "BUSINESS", "BUT", "BUY", "BY", "CALL", "CAMERA", "CAMPAIGN", "CAN", "CANCER", "CANDIDATE", "CAPITAL", "CAR", "CARD", "CARE", "CAREER", "CARRY", "CASE", "CATCH", "CAUSE", "CELL", "CENTER", "CENTRAL", "CENTURY", "CERTAIN", "CERTAINLY", "CHAIR", "CHALLENGE", "CHANCE", "CHANGE", "CHARACTER", "CHARGE", "CHECK", "CHILD", "CHOICE", "CHOOSE", "CHURCH", "CITIZEN", "CITY", "CIVIL", "CLAIM", "CLASS", "CLEAR", "CLEARLY", "CLOSE", "COACH", "COLD", "COLLECTION", "COLLEGE", "COLOR", "COME", "COMMERCIAL", "COMMON", "COMMUNITY", "COMPANY", "COMPARE", "COMPUTER", "CONCERN", "CONDITION", "CONFERENCE", "CONGRESS", "CONSIDER", "CONSUMER", "CONTAIN", "CONTINUE", "CONTROL", "COST", "COULD", "COUNTRY", "COUPLE", "COURSE", "COURT", "COVER", "CREATE", "CRIME", "CULTURAL", "CULTURE", "CUP", "CURRENT", "CUSTOMER", "CUT", "DARK", "DATA", "DAUGHTER", "DAY", "DEAD", "DEAL", "DEATH", "DEBATE", "DECADE", "DECIDE", "DECISION", "DEEP", "DEFENSE", "DEGREE", "DEMOCRAT", "DEMOCRATIC", "DESCRIBE", "DESIGN", "DESPITE", "DETAIL", "DETERMINE", "DEVELOP", "DEVELOPMENT", "DIE", "DIFFERENCE", "DIFFERENT", "DIFFICULT", "DINNER", "DIRECTION", "DIRECTOR", "DISCOVER", "DISCUSS", "DISCUSSION", "DISEASE", "DO", "DOCTOR", "DOG", "DOOR", "DOWN", "DRAW", "DREAM", "DRIVE", "DROP", "DRUG", "DURING", "EACH", "EARLY", "EAST", "EASY", "EAT", "ECONOMIC", "ECONOMY", "EDGE", "EDUCATION", "EFFECT", "EFFORT", "EIGHT", "EITHER", "ELECTION", "ELSE", "EMPLOYEE", "END", "ENERGY", "ENJOY", "ENOUGH", "ENTER", "ENTIRE", "ENVIRONMENT", "ENVIRONMENTAL", "ESPECIALLY", "ESTABLISH", "EVEN", "EVENING", "EVENT", "EVER", "EVERY", "EVERYBODY", "EVERYONE", "EVERYTHING", "EVIDENCE", "EXACTLY", "EXAMPLE", "EXECUTIVE", "EXIST", "EXPECT", "EXPERIENCE", "EXPERT", "EXPLAIN", "EYE", "FACE", "FACT", "FACTOR", "FAIL", "FALL", "FAMILY", "FAR", "FAST", "FATHER", "FEAR", "FEDERAL", "FEEL", "FEELING", "FEW", "FIELD", "FIGHT", "FIGURE", "FILL", "FILM", "FINAL", "FINALLY", "FINANCIAL", "FIND", "FINE", "FINGER", "FINISH", "FIRE", "FIRM", "FIRST", "FISH", "FIVE", "FLOOR", "FLY", "FOCUS", "FOLLOW", "FOOD", "FOOT", "FOR", "FORCE", "FOREIGN", "FORGET", "FORM", "FORMER", "FORWARD", "FOUR", "FREE", "FRIEND", "FROM", "FRONT", "FULL", "FUND", "FUTURE", "GAME", "GARDEN", "GAS", "GENERAL", "GENERATION", "GET", "GIRL", "GIVE", "GLASS", "GO", "GOAL", "GOOD", "GOVERNMENT", "GREAT", "GREEN", "GROUND", "GROUP", "GROW", "GROWTH", "GUESS", "GUN", "GUY", "HAIR", "HALF", "HAND", "HANG", "HAPPEN", "HAPPY", "HARD", "HAVE", "HE", "HEAD", "HEALTH", "HEAR", "HEART", "HEAT", "HEAVY", "HELP", "HER", "HERE", "HERSELF", "HIGH", "HIM", "HIMSELF", "HIS", "HISTORY", "HIT", "HOLD", "HOME", "HOPE", "HOSPITAL", "HOT", "HOTEL", "HOUR", "HOUSE", "HOW", "HOWEVER", "HUGE", "HUMAN", "HUNDRED", "HUSBAND", "I", "IDEA", "IDENTIFY", "IF", "IMAGE", "IMAGINE", "IMPACT", "IMPORTANT", "IMPROVE", "IN", "INCLUDE", "INCLUDING", "INCREASE", "INDEED", "INDICATE", "INDIVIDUAL", "INDUSTRY", "INFORMATION", "INSIDE", "INSTEAD", "INSTITUTION", "INTEREST", "INTERESTING", "INTERNATIONAL", "INTERVIEW", "INTO", "INVESTMENT", "INVOLVE", "ISSUE", "IT", "ITEM", "ITS", "ITSELF", "JOB", "JOIN", "JUST", "KEEP", "KEY", "KID", "KILL", "KIND", "KITCHEN", "KNOW", "KNOWLEDGE", "LAND", "LANGUAGE", "LARGE", "LAST", "LATE", "LATER", "LAUGH", "LAW", "LAWYER", "LAY", "LEAD", "LEADER", "LEARN", "LEAST", "LEAVE", "LEFT", "LEG", "LEGAL", "LESS", "LET", "LETTER", "LEVEL", "LIE", "LIFE", "LIGHT", "LIKE", "LIKELY", "LINE", "LIST", "LISTEN", "LITTLE", "LIVE", "LOCAL", "LONG", "LOOK", "LOSE", "LOSS", "LOT", "LOVE", "LOW", "MACHINE", "MAGAZINE", "MAIN", "MAINTAIN", "MAJOR", "MAJORITY", "MAKE", "MAN", "MANAGE", "MANAGEMENT", "MANAGER", "MANY", "MARKET", "MARRIAGE", "MATERIAL", "MATTER", "MAY", "MAYBE", "ME", "MEAN", "MEASURE", "MEDIA", "MEDICAL", "MEET", "MEETING", "MEMBER", "MEMORY", "MENTION", "MESSAGE", "METHOD", "MIDDLE", "MIGHT", "MILITARY", "MILLION", "MIND", "MINUTE", "MISS", "MISSION", "MODEL", "MODERN", "MOMENT", "MONEY", "MONTH", "MORE", "MORNING", "MOST", "MOTHER", "MOUTH", "MOVE", "MOVEMENT", "MOVIE", "MR", "MRS", "MUCH", "MUSIC", "MUST", "MY", "MYSELF", "NAME", "NATION", "NATIONAL", "NATURAL", "NATURE", "NEAR", "NEARLY", "NECESSARY", "NEED", "NETWORK", "NEVER", "NEW", "NEWS", "NEWSPAPER", "NEXT", "NICE", "NIGHT", "NO", "NONE", "NOR", "NORTH", "NOT", "NOTE", "NOTHING", "NOTICE", "NOW", "N'T", "NUMBER", "OCCUR", "OF", "OFF", "OFFER", "OFFICE", "OFFICER", "OFFICIAL", "OFTEN", "OH", "OIL", "OK", "OLD", "ON", "ONCE", "ONE", "ONLY", "ONTO", "OPEN", "OPERATION", "OPPORTUNITY", "OPTION", "OR", "ORDER", "ORGANIZATION", "OTHER", "OTHERS", "OUR", "OUT", "OUTSIDE", "OVER", "OWN", "OWNER", "PAGE", "PAIN", "PAINTING", "PAPER", "PARENT", "PART", "PARTICIPANT", "PARTICULAR", "PARTICULARLY", "PARTNER", "PARTY", "PASS", "PAST", "PATIENT", "PATTERN", "PAY", "PEACE", "PEOPLE", "PER", "PERFORM", "PERFORMANCE", "PERHAPS", "PERIOD", "PERSON", "PERSONAL", "PHONE", "PHYSICAL", "PICK", "PICTURE", "PIECE", "PLACE", "PLAN", "PLANT", "PLAY", "PLAYER", "PM", "POINT", "POLICE", "POLICY", "POLITICAL", "POLITICS", "POOR", "POPULAR", "POPULATION", "POSITION", "POSITIVE", "POSSIBLE", "POWER", "PRACTICE", "PREPARE", "PRESENT", "PRESIDENT", "PRESSURE", "PRETTY", "PREVENT", "PRICE", "PRIVATE", "PROBABLY", "PROBLEM", "PROCESS", "PRODUCE", "PRODUCT", "PRODUCTION", "PROFESSIONAL", "PROFESSOR", "PROGRAM", "PROJECT", "PROPERTY", "PROTECT", "PROVE", "PROVIDE", "PUBLIC", "PULL", "PURPOSE", "PUSH", "PUT", "QUALITY", "QUESTION", "QUICKLY", "QUITE", "RACE", "RADIO", "RAISE", "RANGE", "RATE", "RATHER", "REACH", "READ", "READY", "REAL", "REALITY", "REALIZE", "REALLY", "REASON", "RECEIVE", "RECENT", "RECENTLY", "RECOGNIZE", "RECORD", "RED", "REDUCE", "REFLECT", "REGION", "RELATE", "RELATIONSHIP", "RELIGIOUS", "REMAIN", "REMEMBER", "REMOVE", "REPORT", "REPRESENT", "REPUBLICAN", "REQUIRE", "RESEARCH", "RESOURCE", "RESPOND", "RESPONSE", "RESPONSIBILITY", "REST", "RESULT", "RETURN", "REVEAL", "RICH", "RIGHT", "RISE", "RISK", "ROAD", "ROCK", "ROLE", "ROOM", "RULE", "RUN", "SAFE", "SAME", "SAVE", "SAY", "SCENE", "SCHOOL", "SCIENCE", "SCIENTIST", "SCORE", "SEA", "SEASON", "SEAT", "SECOND", "SECTION", "SECURITY", "SEE", "SEEK", "SEEM", "SELL", "SEND", "SENIOR", "SENSE", "SERIES", "SERIOUS", "SERVE", "SERVICE", "SET", "SEVEN", "SEVERAL", "SEX", "SEXUAL", "SHAKE", "SHARE", "SHE", "SHOOT", "SHORT", "SHOT", "SHOULD", "SHOULDER", "SHOW", "SIDE", "SIGN", "SIGNIFICANT", "SIMILAR", "SIMPLE", "SIMPLY", "SINCE", "SING", "SINGLE", "SISTER", "SIT", "SITE", "SITUATION", "SIX", "SIZE", "SKILL", "SKIN", "SMALL", "SMILE", "SO", "SOCIAL", "SOCIETY", "SOLDIER", "SOME", "SOMEBODY", "SOMEONE", "SOMETHING", "SOMETIMES", "SON", "SONG", "SOON", "SORT", "SOUND", "SOURCE", "SOUTH", "SOUTHERN", "SPACE", "SPEAK", "SPECIAL", "SPECIFIC", "SPEECH", "SPEND", "SPORT", "SPRING", "STAFF", "STAGE", "STAND", "STANDARD", "STAR", "START", "STATE", "STATEMENT", "STATION", "STAY", "STEP", "STILL", "STOCK", "STOP", "STORE", "STORY", "STRATEGY", "STREET", "STRONG", "STRUCTURE", "STUDENT", "STUDY", "STUFF", "STYLE", "SUBJECT", "SUCCESS", "SUCCESSFUL", "SUCH", "SUDDENLY", "SUFFER", "SUGGEST", "SUMMER", "SUPPORT", "SURE", "SURFACE", "SYSTEM", "TABLE", "TAKE", "TALK", "TASK", "TAX", "TEACH", "TEACHER", "TEAM", "TECHNOLOGY", "TELEVISION", "TELL", "TEN", "TEND", "TERM", "TEST", "THAN", "THANK", "THAT", "THE", "THEIR", "THEM", "THEMSELVES", "THEN", "THEORY", "THERE", "THESE", "THEY", "THING", "THINK", "THIRD", "THIS", "THOSE", "THOUGH", "THOUGHT", "THOUSAND", "THREAT", "THREE", "THROUGH", "THROUGHOUT", "THROW", "THUS", "TIME", "TO", "TODAY", "TOGETHER", "TONIGHT", "TOO", "TOP", "TOTAL", "TOUGH", "TOWARD", "TOWN", "TRADE", "TRADITIONAL", "TRAINING", "TRAVEL", "TREAT", "TREATMENT", "TREE", "TRIAL", "TRIP", "TROUBLE", "TRUE", "TRUTH", "TRY", "TURN", "TV", "TWO", "TYPE", "UNDER", "UNDERSTAND", "UNIT", "UNTIL", "UP", "UPON", "US", "USE", "USUALLY", "VALUE", "VARIOUS", "VERY", "VICTIM", "VIEW", "VIOLENCE", "VISIT", "VOICE", "VOTE", "WAIT", "WALK", "WALL", "WANT", "WAR", "WATCH", "WATER", "WAY", "WE", "WEAPON", "WEAR", "WEEK", "WEIGHT", "WELL", "WEST", "WESTERN", "WHAT", "WHATEVER", "WHEN", "WHERE", "WHETHER", "WHICH", "WHILE", "WHITE", "WHO", "WHOLE", "WHOM", "WHOSE", "WHY", "WIDE", "WIFE", "WILL", "WIN", "WIND", "WINDOW", "WISH", "WITH", "WITHIN", "WITHOUT", "WOMAN", "WONDER", "WORD", "WORK", "WORKER", "WORLD", "WORRY", "WOULD", "WRITE", "WRITER", "WRONG", "YARD", "YEAH", "YEAR", "YES", "YET", "YOU", "YOUNG", "YOUR", "YOURSELF"];
let responses = ["put yo responses heyah"];
function avg(arr) {
  return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0)/arr.length;
}
function stdev(arr) {
  let avg = avg(arr);
  return Math.sqrt(arr.reduce((accumulator, currentValue) => accumulator + (avg-currentValue)*(avg-currentValue), 0)/(arr.length-1));
}
module.exports = (client,msg) => {
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
      }
      let placeholder = [];
      for (let i = 0; i < responses.length; i++) {
        placeholder.push(responses[i]);
      }
      let count = responses.length
      goto = [];
      index = Math.floor(Math.random()*names.length);
      screenName = names[index]; 
      out = "Screen " + screenName + ":\n";
      for (let i = 0; i < count && i < 10; i++) {
        let n = Math.floor(Math.random()*placeholder.length);
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
      vscreens.push([screenName].concat(goto));
      let ind = votescreens.findIndex(function(currentValue) {return (currentValue[0] == msg.author.id)});
      if (ind == -1) { 
        votescreens.push([msg.author.id, screenName]);
      } else {
        votescreens[ind].push(screenName);
      }
      client.users.get("248953835899322370").send(out);
    } else if (msg.content.startsWith("gen$vote")) {
      if (msg.channel.type != "dm") {
        msg.channel.send("Keep your votes private, ya bum."); 
        return;
      }
      let args = msg.content.split(/ +/g);
      if (args.length != 3) {
        msg.channel.send("Uhoh! You're either missing something or added too many arguments. If you're confused, ask PMP#5728 for help!");
        return;
      }
      let len = Math.min(10,responses.length);
      let fil = votescreens.find(function(currentValue) {return (currentValue[0] == msg.author.id)})
      if (fil == undefined) {
        msg.channel.send("I never sent you a single voting screen. Come on.");
        return;
      } else if (fil.indexOf(args[1]) == -1) {
        msg.channel.send("I didn't send you that voting screen. Are you sure you didn't make any spelling errors?");
      }
      vote = [];
      for (let i = 0; i < args[2].length; i++) {
        if (args[2].charCodeAt(i) > 65 + len - 1 || args[2].charCodeAt(i) < 65) {
          msg.channel.send("Invalid character detected!\nAre you sure you used only capital letters in your vote?");
          return;
        } else if (vote.indexOf(args[2].charAt(i)) != -1) {
          msg.channel.send("A repeat letter has been found! Please correct your vote to remove the repetition.");
          return;
        }
        vote.push(args[2].charAt(i));
      }
      out = [args[1]];
      out.push(msg.author.id);
      for (let i = 0; i < responses.length; i++) {
        out.push(-1);
      }
      let thisscreen = vscreens.find(function (currentValue) {return (currentValue[0] == args[1])});
      let omit = (len - vote.length);
      let omitscore = omit*(omit - 1) / 2 / (len-1);
      console.log(thisscreen);
      for (let i = 1; i < len+1; i++) {
        if (vote.indexOf(String.fromCharCode(64+i)) == -1) {
          out[responses.indexOf(thisscreen[i])+1] = omitscore;
          continue;
        }
        out[responses.indexOf(thisscreen[i])+1] = (len-vote.indexOf(String.fromCharCode(64+i))-1)/(len-1);
      }
      votes.push(out);
      msg.channel.send("Your vote on " + args[1] + " of " + args[2] + " has been recorded. Have a good day.");
      client.users.get("248953835899322370").send(msg.author.username + " voted with the following array: [" + out.join(", ") + "]");
    } else {
      msg.channel.send("That's not a command in gen, you know. Try gen$help.");
    }
  }
