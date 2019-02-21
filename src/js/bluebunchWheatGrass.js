function BluebunchWheatGrass() {
    this.scientificName = "Pseudoroegneria spicata";
    this.commonName = "Bluebunch Wheatgrass";
}

BluebunchWheatGrass.prototype = {
    get scientificName() {
        return this.scientificName;
    },

    get commonName() {
        return this.commonName;
    }
};

export default BluebunchWheatGrass;