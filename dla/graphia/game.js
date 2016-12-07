"use strict";

const professorGrammarObj = {
  "name": ["Todd Anderson", "Christina Paxson", "Barrett Hazeltine"],
  "responseFAIL": ["#fail_sentence_1# #fail_sentence_2#"],
  "fail_sentence_1" : ["I really dont understand what you're trying to tell me.",
                      "This was a worrisome communication at best.",
                      "While your appeal has been considered, it has been denied."],
  "fail_sentence_2": ["Unfortunately, the deadline has passed and you fail.",
                      "This is not a satisfactory excuse, please submit your paper #on_platform# by tonight."],
  "on_platform": ["on canvas", "on turnitin.com", "in the google drive", "via dropbox",
                "in the box by my office - STAPPLED PLEASE.", "in the box by my office."],

  "responsePASS": ["#pass_sentence_1# #pass_sentence_2#", "#pass_sentence_1# #pass_sentence_2#, don't expect any more."],
  "pass_sentence_1": ["well, I can certainly tell you're not going to be able to finish the paper in time...BUT,",
                      "This is not the most professional approach, however",
                      "I'm having some trouble understanding you, but"],
  "pass_sentence_2": ["I suppose you can have a #extension_days_regular# day extension on the paper.",
                      "I'll allow it this time, you may have #extension_days_regular# more days",
                      "I suppose another #extension_days_regular# couldn't hurt."],
  "extension_days_regular": ["2", "3", "4", "3", "3"],

  "responseWIN": ["#i_get_it# these things happen - I'm always excited to see the work of my top students, however long it takes!",
                  "Sure that's fine, it's a soft deadline anyway.",
                  " "],
  "i_get_it": ["Oh no!", "I completely understand,", "The way you explained it makes perfect sense,", "Of course," ]
};

const SCORE_WIN = 6;
const SCORE_PASS = 3;

const dictionary = new Typo("en_US", false, false, { dictionaryPath: "../lib/typo/dictionaries" });

// game class
function DysgraphiaGame() {
  this.score = 0;
  this.running = false;
  this.thoughts = [];
  this.thought_idx = 0;
  this.professorName = '';
  this.professorEmail = '';

  this.scoreBonuses = [];

  let professorGrammar = tracery.createGrammar(professorGrammarObj);

  this.getNewProfessorName = function() {
    return professorGrammar.flatten('#name#');
  };

  this.getProfessorEmail = function() {
    let split = this.professorName.split(' ');
    return split[0] + "_" + split[1] + '@brown.edu';
  };

  this.getProfessorResponse = function(score) {
    if (score >= SCORE_WIN) {
      return professorGrammar.flatten('#responseWIN#');
    } else if (score >= SCORE_PASS) {
      return professorGrammar.flatten('#responsePASS#');
    } else {
      return professorGrammar.flatten('#responseFAIL#');
    }
  }

  this.getNextThought = function() {
    this.thought_idx = this.thought_idx % this.thoughts.length;
    return this.thoughts[this.thought_idx++];
  }

  this.setThought = function(text) {
    $('#thought-text').fadeOut(function() {
      $('#thought-text').html(text);
    }).fadeIn();
  }

  this.setHint = function(text) {
    $('#hint span').html(text);
  }

  // getters for html
  this.getThought = function() {
    return $('#thought-text').text();
  }

  this.getTo = function() {
    let val = $('#recipients input').val();
    return val !== undefined ? $.trim(val) : "";
  }

  this.getSubject = function() {
    let val =  $('#subject input').val();
    return  val !== undefined ? $.trim(val) : "";
  }

  this.getBody = function() {
    let val = $('#email-body').val();
    return  val !== undefined ? $.trim(val) : "";
  }

  this.setReplyText = function(subject, emailbody, replybody) {
    $('#reply-subject').text(subject);
    let splitBody = emailbody.split(" ");
    splitBody = splitBody.slice(0, Math.min(splitBody.length, 5));
    splitBody.push("...");
    let preview = splitBody.join(" ");
    $('#reply-my-preview').text(preview);
    $('#reply-prof-name').text(this.professorName);

    $('#reply-subject').text("Re: " + subject);
    $('#reply-body').text(replybody);
  }

  // Computes score for a submitted email based on contents of email
  // examines wordcount, number of typos and time.
  this.computeScoreAndGetReply = function(to, subject, body) {
    let typos =  0;

    if (to.toLowerCase() !== this.professorEmail.toLowerCase() ) {
      this.score = 0;
      return 'BAD EMAIL'
    }

    let subjectSplit = subject.split(" ");
    if (subjectSplit.indexOf('extension') != 0 ) {
      // +1 for using 'extension' in the subject
      this.scoreBonuses.push('<span class="positive"> +1, be direct </span>');
      this.score += 1;
    }

    // check body for typos, capitalization and word count,
    let bodySplit = body.split(" ");
    let bodyWC = bodySplit.length;
    let goodCaps = true;
    for (var i = 0; i < bodyWC; i++) {
      let word = bodySplit[i];
      if (i == 0 || (bodySplit[i-1].slice(-1) === ".")) {
        let firstChar = word.slice(0,1);
        if (firstChar !== firstChar.toUpperCase()) {
          goodCaps = false;
          break;
        }
      }
      typos += dictionary.check(word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")) ? 0 : 1;
    }

    if (goodCaps) {
      this.scoreBonuses.push('<span class="positive"> +1, hooray, you capitalized correctly </span>');
      this.score += 1;
    } else {
      this.scoreBonuses.push('<span class="negative"> -1, CAN YOU TELL WHAT YOU WERE MISSING? </span>');
      this.score -= 1;
    }

    if (bodyWC > 50) {
      this.scoreBonuses.push('<span class="negative"> -1, wordy </span>');
      this.score -= 1;
    } else if (bodyWC > 15) {
      this.scoreBonuses.push('<span class="positive"> +1, length seems right </span>');
      this.score += 1;
    } else {
      this.scoreBonuses.push('<span class="negative"> -1, too short </span>');
      this.score -= 1;
    }

    if (typos > 8 || typos > bodyWC/4) {
      this.scoreBonuses.push('<span class="negative"> -2, did you even proofread? </span>');
      this.score -= 2;
    } else if (typos > 2) {
      this.scoreBonuses.push('<span class="negative"> -1, almost perfect </span>');
      this.score -= 1;
    } else if (typos == 0) {
      this.scoreBonuses.push('<span class="positive"> +3, perfect spelling </span>');
      this.score += 3;
    }

    return this.getProfessorResponse(this.score);
  }

  // game end, calculate score and show reply email
  this.stop = function() {
      clearInterval(this.running);
      $('#timer').hide();

      let to = this.getTo();
      let subject = this.getSubject();
      let body = this.getBody();
      let replyTxt = this.computeScoreAndGetReply(to, subject, body);
      $("#score-num").text(this.score);
      $('#email').hide();
      $('#thought').hide();
      $('#splashscreen').fadeIn();

      $('#splashscreen-message').text("A few minutes later you recieve a reply...");
      $("#start-button").text("Another");
      this.setReplyText(subject, body, replyTxt);
      setTimeout(function () {
        $("#score").show();
        if(replyTxt === 'BAD EMAIL') {
          $('#splashscreen-message').html("You didn't even get the email right. <br> <br> Game Over");
        } else {
          let bonusList = ""
          for (var i = 0; i < game.scoreBonuses.length; i++) {
            bonusList += game.scoreBonuses[i] + "<br>";
          }
          $('#splashscreen-message').html(bonusList);
          $('#reply').fadeIn();

        }
      }, 3000)
  }

  // keeps track of time, iterates through 'thought' hints
  this.tick = function() {
    //update the time
    $('#timer-text').text(parseInt(game.time--));

    if (game.time < 0) {
      game.stop();
      return;
    }

    if (game.time % 7 == 0) {
      game.setThought(game.getNextThought());
    }
  };

  // set up input handlers and other jquery stuff
  this.setup = function() {
    //set the title on subject change
    $('#subject input').focusout(function() {
      let subject = game.getSubject();
      if (subject)
        $('#titlebar span').text(subject);
    });

    $('#send').click(function() {
      $("#email").fadeOut();
      $("#splashscreen").fadeIn();
      game.stop();
    });

    $("#email-body").on("keyup", function() {
      let currentVal = $(this).val();

    });
  }

  this.start = function() {
    // Clear everything
    var elements = document.getElementsByTagName("input textarea");
    for (var ii=0; ii < elements.length; ii++) {
      if (elements[ii].type == "text") {
        elements[ii].value = "";
      }
    }
    this.setup();

    // reset game var
    this.time = 90;
    this.score = 0;
    this.professorName = this.getNewProfessorName();
    this.professorEmail = this.getProfessorEmail();
    // init the thoughts array after professor has been generated
    this.thoughts =["Your paper is due in an hour. You are throughly unprepared and have nothing. The time is nigh -  You must request <span class=\"highlight\">an extension!</span>",
    "Hmm, you're pretty sure you need to be emailing <span class=\"highlight\">" + this.professorName + "</span> at <span class=\"highlight\">" + this.professorEmail + "</span>",
    "You can't remember if this is the first or the second night you've been awake.",
    "...<br>Your stomach is growling."
    ]
    this.scoreBonuses = [];

    this.running = setInterval(this.tick, 1000);
    this.setThought(this.getNextThought());
    return;
  }

}

function rand_range(max) {
    return Math.floor(Math.random() * (max + 1));
}

