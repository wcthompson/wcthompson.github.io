"use strict";

const professorGrammarObj = {
  "name": ["Todd Anderson", "Christina Paxson", "Barrett Hazeltine"],
  "responseFAIL": ["#fail_sentence_1# #fail_sentence_2#"],
  "fail_sentence_1" : ["I really dont understand what you're trying to tell me.", "This was a worrisome communication at best.", "While your appeal has been considered, it has been denied."],
  "fail_sentence_2": ["Unfortunately, the deadline has passed and you fail.", "This is not a satisfactory excuse, please submit your paper on canvas by tonight."],

  "responsePASS": ["#pass_sentence_1# #pass_sentence_2#"],
  "pass_sentence_1": ["well, I can certainly tell you're not going to be able to finish the paper in time...BUT,", "This is not the most professional approach, however..."],
  "pass_sentence_2": ["I suppose you can have a #extension_days_regular# day extension on the paper."],
  "extension_days_regular": ["2", "3", "4", "3", "3"],

  "responseWIN": ["#i_get_it#, these things happen - I'm always excited to see the work of my top students, however long it takes!"],
  "i_get_it": ["I completely understand", "The way you explained it makes perfect sense", ]
};

const thoughtGrammarObj = {
  "thoughts": [""]
}

// game class
function DysgraphiaGame() {
  this.score = 0;
  this.running = false;

  this.professorName = '';
  this.professorEmail = '';

  let professorGrammar = tracery.createGrammar(professorGrammarObj);
  let thoughtGrammar = tracery.createGrammar(thoughtGrammarObj);

  this.getNewProfessorName = function() {
    return professorGrammar.flatten('#name#');
  };

  this.getProfessorEmail = function() {
    let split = this.professorName.split(' ');
    return split[0] + "_" + split[1] + '@brown.edu';
  };

  this.getProfessorResponse = function(score) {
    if (score >= 5) {
      return professorGrammar.flatten('#responseWIN#');
    } else if (score > 2) {
      return professorGrammar.flatten('#responsePASS#');
    } else {
      return professorGrammar.flatten('#responseFAIL#');
    }
  }

  this.getNewThought = function() {
    return thoughtGrammar.flatten('#thoughts#');
  }

  this.setThought = function(text) {
    $('#thought-text').text(text);
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
    return val !== undefined ? val : "";
  }

  this.getSubject = function() {
    let val =  $('#subject input').val();
    return  val !== undefined ? val : "";
  }

  this.getBody = function() {
    let val = $('#email-body').val();
    return  val !== undefined ? val : "";
  }

  // Computes score for a submitted email based on contents of email
  // examines wordcount, number of typos and time.
  this.computeScore = function(to, subject, body) {
    let typos =  0;

    //TODO: compute typos
    console.log(to)
    if (to.toLowerCase() === this.professorEmail.toLowerCase() ) {
      this.score += 2;
      console.log('email match')
    }

    let subjectSplit = subject.split(" ");
    if (subjectSplit.indexOf('extension') != 0 ) {
      // +1 for using 'extension' in the subject
      this.score += 2;
    }

    let bodySplit = body.split(" ");
    if (bodySplit.length > 100) {
      this.score -= 1;
    } else if (bodySplit.length > 20) {
      this.score += 2;
    }

    if (bodySplit.length > 0 && typos < 1) {
      this.score += 2;
    }

  }

  // set up input handlers and other jquery stuff
  this.setup = function() {
    //set the title on subject change
    $('#subject input').focusout(function() {
      let subject = this.getSubject();
      if (subject)
        $('#titlebar span').text(subject);
    });

    $('#send').click(function() {
      $("#email").fadeOut();
      $("#splashscreen").fadeIn();
      game.stop();
    });
  }

  // game end, calculate score and show reply email
  this.stop = function() {

      //clearInterval(game.running);
      this.running = false;
      let to = $.trim(this.getTo());
      let subject = $.trim(this.getSubject());
      let body = $.trim(this.getBody());
      this.computeScore(to, subject, body);
      $("#score-num").text(this.score);
      $("#score").show();
      let reply = this.getProfessorResponse(this.score);
      $('#email').hide();
      $('#splashscreen').fadeIn();
      $('#splashscreen-message').text("After awhile you recieve a reply...");
      setTimeout(function () {
        $('#splashscreen-message').text(reply);
      }, 3000)
  }

  this.tick = function() {
    //update the time
    //$('#timer-text').text(parseInt(game.time--));

    if (game.time < 0) {
      // game end, calculate score and show reply email

      return;
    }

    if (game.time % 7 == 0) {
      //game.setThought(game.getNewThought());
    }
  };

  this.start = function() {
    // TODO: show opening screen w/ story
    console.log(this);
    this.setup();
    // reset game var
    this.time = 90;
    this.score = 0;
    this.professorName = this.getNewProfessorName();
    this.professorEmail = this.getProfessorEmail();
    this.running = true;//setInterval(this.tick, 1000);
    this.setThought("Your paper is due in an hour. You are throughly unprepared and have nothing. The time is nigh -  You must request an extension!");
    this.setHint("<b>Professor:</b> " + this.professorName + "\n<br><b>Email:</b> " + this.professorEmail);
    console.log('start');
    return;
  }

}

function rand_range(max) {
    return Math.floor(Math.random() * (max + 1));
}

