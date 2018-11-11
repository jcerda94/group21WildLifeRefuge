/*
    Constructor for Red Tailed Hawk Object
    @param gender   gender of the Hawk object
    @param color    color of the Hawk object (not sure if this is necessary)
    @param size     size of Hawk object (small, medium, or large)
    @param speed    speed of flight in Miles per hour for Hawk object (slow, normal, fast)
 */
function RedTailedHawk(gender, color, size, speed) {
    this.color = color;
    this.gender = gender;
    this.size = size;
    this.speed = speed;
    this.scientificName = 'Buteo jamaicensis';
    this.commonName = 'Red-Tailed Hawk';
    this.animalType = 'Bird'
    this.diet = 'Carnivore';
    this.avgLifeSpan = '21 years';

    //Reference: https://www.allaboutbirds.org/guide/Red-tailed_Hawk/id
    if (this.gender.toLowerCase() === 'male') {
        if (this.size.toLowerCase() === 'small') {
            this.lengthInches = (Math.random() * 17.7) + 19.2;
            this.weightOunces = (Math.random() * 24.3) * 31.5;
            this.wingspanInches = (Math.random() * 44.9) + 47.4;
        } else if (this.size.toLowerCase() === 'medium') {
            this.lengthInches = (Math.random() * 19.3) + 20.8;
            this.weightOunces = (Math.random() * 31.6) * 38.8;
            this.wingspanInches = (Math.random() * 47.5) + 49.9;
        } else if (this.size.toLowerCase() === 'large') {
            this.lengthInches = (Math.random() * 20.9) + 22.1;
            this.weightOunces = (Math.random() * 38.9) * 45.9;
            this.wingspanInches = (Math.random() * 50.0) + 52.4;
        }
    } else if (this.gender.toLowerCase() === 'female') {
        if (this.size.toLowerCase() === 'small') {
            this.lengthInches = (Math.random() * 17.7) + 20.7;
            this.weightOunces = (Math.random() * 31.8) * 38.4;
            this.wingspanInches = (Math.random() * 44.9) + 47.4;
        } else if (this.size.toLowerCase() === 'medium') {
            this.lengthInches = (Math.random() * 20.8) + 23.4;
            this.weightOunces = (Math.random() * 38.5) * 45.0;
            this.wingspanInches = (Math.random() * 47.5) + 49.9;
        } else if (this.size.toLowerCase() === 'large') {
            this.lengthInches = (Math.random() * 23.5) + 26.0;
            this.weightOunces = (Math.random() * 45.1) * 51.5;
            this.wingspanInches = (Math.random() * 50.0) + 52.4;
        }
    }

    if (this.speed.toLowerCase() === 'slow') {
        this.speedMph = (Math.random() * 10) + 20;
    } else if (this.speed.toLowerCase() === 'fast') {
        this.speedMph = (Math.random() * 51) + 121;
    } else {
        this.speed = 'normal';
        this.speedMph = (Math.random() * 21) + 50;
    }

    this.hover = function() {
        //TODO: create logic to have Hawk hover in circular pattern.
    }
    
    this.dive = function() {
        //TODO: create logic to have Hawk dive after prey.
    }

    this.reproduce = function() {
        //TODO: create logic to have Hawk reproduce if object is paired with a mate.
    }

    this.feed = function() {
        //TODO: create logic to have Hawk feed on captured prey.
    }
}

RedTailedHawk.prototype = {
    get gender() {
        return this.gender;
    },

    set gender(gender) {
        this.color = gender;
    },

    get color() {
        return this.color;
    },

    set color(color) {
        this.color = color;
    },

    get size() {
        return this.size;
    },

    set size(size) {
        this.size = size;
    },

    get speed() {
        return this.speed;
    },

    set speed(speed) {
        this.speed = speed;
    },

    get scientificName() {
        return this.scientificName;
    },

    get commonName() {
        return this.commonName;
    },

    get animalType() {
        return this.animalType;
    },

    get diet() {
        return this.diet;
    },

    get avgLifeSpan() {
        return this.avgLifeSpan;
    }
};