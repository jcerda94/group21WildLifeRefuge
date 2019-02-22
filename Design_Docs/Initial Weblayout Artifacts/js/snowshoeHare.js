/*
    Constructor for Snowshoe Hare Object
    @param gender   gender of the Hare object(may not be needed)
    @param color    color of the Hare object, white in the winter and brown in the spring
    @param size     size of Hare object (small, medium, or large)
    @param speed    speed of flight in Miles per hour for Hare object (slow, normal, fast)
 */

function SnowshoeHare(gender, color, size, speed)
{
    //this.gender = gender; according to resources attributes are gender neutral
    this.size = size;
    this.color = color;
    this.speed = speed;
    this.scientificName =  "Lepus americanus";
    this.commonName = "Snowshoe Hare";
    this.animalType = "Mammals";
    this.diet = "Herbivores";
    this.avgLifeSpan = "1 year";

    //references: https://beta.eol.org/pages/133023/data and http://www.animalspot.net/snowshoe-hare.html

        if (this.size.toLowerCase() === "small") {
            this.lengthInches = (Math.random() * 7);
            this.weightOunces = (Math.random() * 32);
        } else if (this.size.toLowerCase() === "medium") {
            this.lengthInches = (Math.random() * 8.5)
            this.weightOunces = (Math.random() * 45);
        } else if (this.size.toLowerCase() === "large") {
            this.lengthInches = (Math.random() * 10);
            this.weightOunces = (Math.random() * 64);
        }
        //hare only has one speed level; they are naturally fast so their speed is normal.
        if (this.speed.toLowerCase() === "normal")
        {
            this.speedMph = (Math.random() * 24);
        }
        this.run = function() {
            //TODO: create logic to have the Hare run to a certain spot on the terrain.
        }
        
        this.hide = function() {
            //TODO: create logic to have Hare hide from prey.
        }
    
        this.reproduce = function() {
            //TODO: create logic to have Hare reproduce if object is paired with a mate.
        }
    
        this.feed = function() {
            //TODO: create logic to have Hare feed on plant objects.
        }
}
SnowshoeHare.prototype = {
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