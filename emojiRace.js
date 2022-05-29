"use strict";

/** Emoji Race
 *
 * Two emojis race one another when "Start Race" button clicked
 * The first emoji to reach the finish line wins!
 *
 * The amount of steps a contestant takes when racing is random
 * The location of the finish line is determined by the window size.
 */

// DO NOT CHANGE THESE VARIABLES
const FINISH_LINE_OFFSET = 200;
const TIME_BETWEEN_STEPS_MS = 100;
const MIN_STEPS = 5;
const MAX_STEPS = 20;

const finishLine = document.getElementById("finish-line");
const raceTrack = document.getElementById("race-track");
const startRaceButton = document.getElementById("start-race");
const c1HtmlLocation = document.getElementById("contestant-1");
const c2HtmlLocation = document.getElementById("contestant-2");
const c1HtmlStepDisplay = document.getElementById("contestant-1-steps");
const c2HtmlStepDisplay = document.getElementById("contestant-2-steps");
const announcementArea = document.getElementById("winner-announcement");

let raceTrackWidth = raceTrack.offsetWidth;
let finishLineLocation = raceTrackWidth - FINISH_LINE_OFFSET;

/** Race takes in two instances of a Contestant and creates an instance of a Race utilizing these two. */
class Race {
  /** Takes in two isntances of a Contestant. Constructs an instance of a Race by assigning values to its properties. */
  constructor(contestant1, contestant2) {
    this.contestants = [contestant1, contestant2];
    this.raceWinner = null;
    this.raceTimerId = null;
    this.checkForWinner = this.checkForWinner.bind(this);
    this.racing = this.racing.bind(this);

    console.log('New Race has been created!')
    console.log("contestants = ", this.contestants, "raceWinner = ", this.raceWinner, "raceTimerId = ", this.raceTimerId);
  }

  /** Takes no arguments and sets the raceTimerId of the Race instance to the setIntervalId
   *  of the racing method continually being invoked every TIME_BETWEEEN_STEPS_MS.
   */
  startRace() {
    this.raceTimerId = setInterval(this.racing, TIME_BETWEEN_STEPS_MS);
    console.log("startRace has been ran. raceTimerId = ", this.raceTimerId);
  }

  /** Takes no arguments and invokes checkForWinner. If there is a winner, sets raceWinner
   *  to the winner, invokes endRace and returns out of the method. If no winner, invokes
   *  both contestants' move methods.
   */
  racing() {
    const winningContestant = this.checkForWinner();
    console.log("racing! winningContestant = ", winningContestant);
    console.log("racing's context = ", this);
    if (winningContestant) {
      this.raceWinner = winningContestant;
      this.endRace();
      return;
    } else {
      for (let contestant of this.contestants) {
        contestant.move();
        console.log("contestant has moved! contestant = ", contestant);
      }
    }
  }

  /** Takes in no arguments and checks if either contestants has crossed the finish line.
   *  If so, returns the winning contestant. If not, returns undefined.
   */
  checkForWinner() {
    const [c1, c2] = this.contestants;

    const haveWinner = (
      c1.stepsTaken >= finishLineLocation ||
      c2.stepsTaken >= finishLineLocation);

    console.log("haveWinner = ", haveWinner);
    if (haveWinner) {
      if (c1.stepsTaken >= finishLineLocation) {
        return c1;
      } else if (c2.stepsTaken >= finishLineLocation) {
        return c2;
      }
    }
  }

  /** Takes in no arguments and stops startRace method. Then invokes the announceWinner method. */
  endRace() {
    console.log("endRaces's context = ", this, "this.raceWinner = ", this.raceWinner);
    clearInterval(this.raceTimerId);
    this.announceWinner(this.raceWinner);
  }

  /** Takes in the winning instance of the Contestant, creates a winning message, and displays it in 
   *  the announcementArea.
   */
  announceWinner(contestant) {
    console.log("announceWinner's context = ", this, "contestant = ", contestant);
    const winMsg = `${contestant.emoji} has won the race in ${contestant.stepsTaken} steps!`;
    announcementArea.append(winMsg);

  }
}


class Contestant {
  constructor(emoji, htmlLocation, htmlStepDisplay) {
    this.emoji = emoji;
    this.htmlLocation = htmlLocation;
    this.htmlStepDisplay = htmlStepDisplay;
    this.stepsTaken = 0;

    htmlLocation.innerText = emoji;
    this.updateHtmlSteps();
  }

  /** Invokes the randomSteps method and updates the location of the Contestant by 
   *  invoking updateHtmlSteps.
   */
  move() {
    const stepsToTake = this.randomSteps();
    this.stepsTaken += stepsToTake;

    this.htmlLocation.style.left = `${this.stepsTaken}px`;

    this.updateHtmlSteps();
  }

  /** Returns a random number of steps between MAX_STEPS and MIN_STEPS, both inclusive. */
  randomSteps() {
    // Equation found at https://www.w3schools.com/js/js_random.asp
    const randomSteps = Math.floor(Math.random() * (MAX_STEPS - MIN_STEPS + 1) ) + MIN_STEPS;
    console.log('randomSteps = ', randomSteps);

    return randomSteps;
  }

  /** updateHtmlSteps: update a contestant's steps displayed in DOM */
  updateHtmlSteps() {
    this.htmlStepDisplay.innerText = `${this.emoji} steps: ${this.stepsTaken}`;
  }
}


function handleStartBtn() {
  const c1 = new Contestant("🎃", c1HtmlLocation, c1HtmlStepDisplay);
  const c2 = new Contestant("🐧", c2HtmlLocation, c2HtmlStepDisplay);
  const race = new Race(c1, c2);
  race.startRace();
}


function resizeTrack() {
  raceTrackWidth = raceTrack.offsetWidth;
  finishLineLocation = raceTrackWidth - FINISH_LINE_OFFSET;
  finishLine.style.left = `${finishLineLocation}px`;
}


function main() {
  // default position of html finish line: 200px before end of racetrack
  finishLine.style.left = `${finishLineLocation}px`;

  // update position of html finish line when window resized
  window.addEventListener("resize", resizeTrack);

  // create and setup a new race
  startRaceButton.addEventListener("click", handleStartBtn);
}


main();
