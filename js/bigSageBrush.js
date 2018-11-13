function BigSagebrush() {
    this.scientificName = 'Artemisia tridentata';
    this.commonName = 'Big Sagebrush';
}

BigSagebrush.prototype = {
    get scientificName() {
        return this.scientificName;
    },

    get commonName() {
        return this.commonName;
    }
};