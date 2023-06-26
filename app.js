// creating the class of ships
class Ship {
  //initalizes ship's properties
  constructor(hull, firepower, accuracy) {
    this.hull = hull;
    this.firepower = firepower;
    this.accuracy = accuracy;
  }
  
  //method that stimulates attack on target ship
  attack(target) {
    //calculates random number and compares to ship's accuracy
    //if random number is less than ship's accuracy
    if (Math.random() < this.accuracy) {
      //reduce hull by attacker's firepower
      target.hull -= this.firepower;
      console.log(`Attack successful!`);
    } else {
      console.log(`Attack missed!`);
    }
  }
}  
  
// creating the players spaceship
class USSAssembly extends Ship {
  //initializes ships properties
  constructor(hull, firepower, accuracy) {
    //adds properties from ship class
    super(hull, firepower, accuracy);
    //add new properties to players ship
    this.shields = 0;
    this.missiles = 3;
    this.points = 0;
    this.wins = 0;
    this.medals = 0;
  }
  
  //activates ship's shield by adding random value between 1-5
  activateShields() {
    this.shields += Math.floor(Math.random() * 4) + 1;
    console.log(`Shields activated! Current shields: ${this.shields}`);
  }
  
  //launches missiles at target ship
  launchMissile(target) {
    if (this.missiles > 0) {
      target.hull -= 10;
      this.missiles--;
      console.log(`Missile launched! It does 10 damage.`);
    } else {
      console.log(`No missiles left!`);
    }
  }
  
  //resets ship's properties to it's inital values
  reset() {
    this.hull = 20;
    this.firepower = 5;
    this.accuracy = 0.7;
    this.shields = 0;
    this.missiles = 3;
  }
}
  
// creating Alien ship class with weapon pods
class AlienShip extends Ship {
  //origanl properties from the class ship
  constructor(hull, firepower, accuracy) {
    super(hull, firepower, accuracy);
    //new properties for this class
    this.weaponPods = [];
    //generates a random number of weapon pods btw 1-3
    const numWeaponPods = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numWeaponPods; i++) {
      //ensures the hull values of each weapon pod will be at least 2
      const podHull = Math.floor(Math.random() * 4) + 2;
      //creating an object literal and then pushed into weaponPods array
      this.weaponPods.push({ hull: podHull });
    }
  }
  
  //overrides the base attack method 
  attack(target) {
    //invokes the attack method from parent class ship
    super.attack(target);
    //checking if the target is an instance of the USSAssembly class
    if (target instanceof USSAssembly) {
      // then reduce shields by a random number btw 1-3 
      target.shields -= Math.floor(Math.random() * 3) + 1;
      console.log(`USS Assembly shields reduced to ${target.shields}`);
    }
  }
}
  
// Game settings
//defines the minimum and maximum values for alien ship properties
const baseDifficulty = {
  alienHullMin: 3,
  alienHullMax: 6,
  alienFirepowerMin: 2,
  alienFirepowerMax: 4,
  alienAccuracyMin: 0.6,
  alienAccuracyMax: 0.8,
};
  
// Creating USS Assembly the player's spaceship
const ussAssembly = new USSAssembly(20, 5, 0.7);

// Game loop
let isPlaying = true;
  
while (isPlaying) {
  console.log(`======== New Battle ========`);

  // Creating alien ships and generating random number alien ships to create btw 2-6
  const alienShips = [];
  const numAlienShips = Math.floor(Math.random() * 5) + 2;

  //creating instances of alien with random properties then pushing them to AlienShip array
  for (let i = 0; i < numAlienShips; i++) {
    //creating a random hull btw 3 + 6
    const hull = Math.floor(Math.random() * (baseDifficulty.alienHullMax - baseDifficulty.alienHullMin + 1)) + baseDifficulty.alienHullMin;
    //creating a random firepower btw 2 + 4
    const firepower = Math.floor(Math.random() * (baseDifficulty.alienFirepowerMax - baseDifficulty.alienFirepowerMin + 1)) + baseDifficulty.alienFirepowerMin;
    //creating a random accuracy btw 0.6 + 0.8
    const accuracy = Math.random() * (baseDifficulty.alienAccuracyMax - baseDifficulty.alienAccuracyMin) + baseDifficulty.alienAccuracyMin;
    //pushing random properties into alienShips array
    alienShips.push(new AlienShip(hull, firepower, accuracy));
  }
  
  //keeps track of current alien ship being battled
  let currentShipIndex = 0;
  //tracks whether player is retreating 
  let isRetreating = false;

  //the loop runs while currentShipIndex is less than the total number of alien ships and the player hasn't retreated
  while (currentShipIndex < numAlienShips && !isRetreating) {
    //adding 1 to start from 1 instead of zero since index starts at 0
    console.log(`=== Battle ${currentShipIndex + 1} ===`);

    const currentAlienShip = alienShips[currentShipIndex];
  
    // Player's turn
    console.log(`Player's turn:`);
    //calling the activateShields method on ussAssembly
    ussAssembly.activateShields();
  
    //conditional to confirm player wants to use missiles and then launch
    if (ussAssembly.missiles > 0) {
      const useMissile = confirm(`Do you want to launch a missile? Click 'OK' to use a missile or 'Cancel' to skip.`);
      if (useMissile) {
        ussAssembly.launchMissile(currentAlienShip);
      }
    }

    //player attacks alien ship by calling attack method
    ussAssembly.attack(currentAlienShip);

    // Check if alien ship is destroyed
    if (currentAlienShip.hull <= 0) {
      console.log(`Alien ship destroyed!`);
 
      // Check if the alien ship had weapon pods
      //if pods remaining
      if (currentAlienShip.weaponPods.length > 0) {
        console.log(`Weapon pods destroyed!`);
        //decreasing a pod in the weaponPods
        currentAlienShip.weaponPods.shift();
        //if no pods left
      } else {
        //alien ship destroyed; increase number of alien ships battled and add points, wins, and medals.
        currentShipIndex++;
        ussAssembly.points++;
        ussAssembly.wins++;
        ussAssembly.medals += 2;
        console.log(`Battle ${currentShipIndex} won! Points: ${ussAssembly.points}`);

        //if there are more alien ships to battle
        if (currentShipIndex < numAlienShips) {
          //prompt to recharge shields
          const rechargeShields = confirm(`Do you want to return to base and recharge shields? Click 'OK' to recharge or 'Cancel' to continue to the next battle.`);
          //if recharge, retreat to reset ussAssembly ship properties 
          if (rechargeShields) {
            ussAssembly.reset();
            isRetreating = true;
            console.log(`Returning to base for shield recharge.`);
          }
          //if no more alien ships to battle, then player won and exit game loop
        } else {
          console.log(`Congratulations! You won all battles!`);
          isPlaying = false;
          break;
        }
      }
      //if the alien ship is not destroyed
    } else {
      //then it's the alien turn
      console.log(`Alien's turn:`);
      //the alien ship attacks the player's ship
      currentAlienShip.attack(ussAssembly);

      //check if USS Assembly is destroyed
      if (ussAssembly.hull <= 0) {
        console.log(`USS Assembly destroyed. Game over.`);
        //indicates the game should stop running
        isPlaying = false;
        //terminates the loop
        break;
      }
    }
  }
}
  
console.log(`Game over. Total points: ${ussAssembly.points}`);
