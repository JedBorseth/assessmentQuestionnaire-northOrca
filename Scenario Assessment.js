class BulletTrain {
  constructor(parent) {
    this.parent = parent;
    this.characters = [];
    this.board(10);
    this.ride();
    this.stop();
    this.ride();
    this.derail();
  }

  /**
   * brings characters onto the train
   */
  async board(amount) {
    for (let i = 0; i < amount; i++) {
      const character = await StationAPI.getCharacter(i);
      this.characters.push(character);
    }
  }

  /**
   * moved characters while the train is moving
   */
  ride() {
    // Using forEach Loops to improve readability
    this.characters.forEach((character) => {
      character.move();
      this.characters.forEach((otherCharacter) => {
        if (
          character !== otherCharacter &&
          character.currentCar === otherCharacter.currentCar
        ) {
          character.fight(otherCharacter);
        }
      });
    });
    // for (const character of this.characters) {
    //   character.move();
    //   for (const otherCharacter of this.characters) {
    //     if (
    //       character !== otherCharacter &&
    //       character.currentCar === otherCharacter.currentCar
    //     ) {
    //       character.fight(otherCharacter);
    //     }
    //   }
    // }
  }

  /**
   * stops the train for more characters to board
   */
  async stop() {
    const timerStart = Date.now();
    const stationName = await StationAPI.arrive();
    await this.board(100);
    const timerEnd = Date.now();
    const timeElapsed = timerEnd - timerStart;
    console.log(
      `The train stopped for ${timeElapsed} milliseconds at ${stationName} station`
    );
  }

  /**
   * moves character to unalive state
   */
  derail() {
    const randomCar = BulletTrain.getCar();
    this.characters.forEach((character) => {
      // Using forEach Loops to improve readability
      if (character.currentCar === randomCar) {
        character.die();
      }
    });
    this.parent.destroy(this);

    // for (const character of this.characters) {
    //   if (character.currentCar === randomCar) {
    //     character.die();
    //   }
    // }
  }

  /**
   * gets a random car number
   * @returns {number} random car number between 1 and 10
   */
  static getCar() {
    return Math.floor(Math.random() * 10) + 1;
  }
}

class StationAPI {
  /**
   * gets a character
   * @param {number} index index of character to get
   * @returns character at index
   */
  static getCharacter(index) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (index < 0 || index > StationAPI.characters.length) {
          reject("Invalid index");
        }
        const character = StationAPI.characters[index];
        resolve(character);
      }, 1000);
    });
  }

  /**
   * returns the stop name
   * @returns {Promise} station name
   */
  static arrive() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("Kyoto");
      }, 1000);
    });
  }
}

class Character {
  constructor(characterName) {
    this.characterName = characterName;
    this.health = 100;
    this.move();
  }

  move() {
    this.currentCar = BulletTrain.getCar();
  }

  fight(character) {
    character.health -= 10;
  }

  die() {
    this.health = 0;
  }
}
StationAPI.characters = [
  new Character("The Wolf"),
  new Character("Lemon"),
  new Character("Tangerine"),
  new Character("Ladybug"),
  // assume 1000 more characters
];
