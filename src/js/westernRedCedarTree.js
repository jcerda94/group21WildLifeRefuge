/*
    Constructor for Western Red Cedar Object
    @param size         size of the Western Red Cedar object (small, medium, large)
    @param coneAge      Age of the cones in months for the Western Red Cedar object
    @param pollinated   boolean value for whether cones have been pollinated or not.
 */
function WesternRedCedar(size, coneAge, pollinated) {
    this.age;
    this.diameterFeet;
    this.heightFeet;
    this.size;
    this.leafColor = '#99ff33'; //Lighter Green with Yellow Tint (w3schools colorpicker)
    this.leafLengthInches = (Math.random() * 0.039) + 0.157;
    this.leafBreadthInches = (Math.random() * 0.039) + 0.47;
    this.coneColor = '#9ACD32';
    this.coneAge = coneAge; //age in months
    this.pollinated = false;
    this.coneLengthInches = (Math.random() * 0.39) * 0.71;
    this.coneBreadthInches = (Math.random() * 0.16) * 0.20;
    this.coneScales = (Math.random() * 8) + 14;
    this.scientificName = 'Thuja plicata';
    this.commonName = 'Western Red Cedar';

    //Reference: https://en.wikipedia.org/wiki/Thuja_plicata
    if (this.size.toLowerCase() === 'small') {
        this.heightFeet = (Math.random() * 213.0) + 218.7;
        this.diameterFeet = (Math.random() * 9.8) + 10.9;
    } else if (this.size.toLowerCase() === 'medium') {
        this.heightFeet = (Math.random() * 218.8) + 224.4;
        this.diameterFeet = (Math.random() * 11) + 12;
    } else if (this.size.toLowerCase() === 'large') {
        this.heightFeet = (Math.random() * 224.5) + 230;
        this.diameterFeet = (Math.random() * 12.1) + 13.1;
    }

    if (coneAge < 6) {
        this.coneColor = '#9ACD32';
    } else if (coneAge >= 6 && pollinated) {
        this.coneColor = '#996633';
    }
}

WesternRedCedar.prototype = {
    get age() {
        return this.age;
    },

    set age(age) {
        this.age = age;
    },

    get diameterFeet() {
        return this.diameterFeet;
    },

    set diameterFeet(diameter) {
        this.diameterFeet = diameter;
    },

    get heightFeet() {
        return this.heightFeet;
    },

    set heightFeet(height) {
        this.heightFeet = height;
    },

    get scientificName() {
        return this.scientificName;
    },

    get commonName() {
        return this.commonName;
    },

    get leafColor() {
        return this.leafColor;
    },

    set leafColor(color) {
        this.leafColor = color;
    },

    get leafLengthInches() {
        return this.leafLengthInches;
    },

    get  leafBreadthInches() {
        return this.leafBreadthInches;
    },

    set coneColor(color) {
        this.coneColor = color;
    },

    get coneColor() {
        return this.coneColor;
    },

    set coneAge(age) {
        this.coneAge = age;
    },

    get coneAge() {
        return this.coneAge;
    },

    set pollinated(p) {
        this.pollinated = p;
    },

    get pollinated() {
        return this.pollinated;
    },

    get coneLengthInches() {
        return this.coneLengthInches;
    },

    get coneBreadthInches() {
        return this.coneBreadthInches;
    },

    get coneScales() {
        return this.coneScales;
    }
};

export default WesternRedCedar