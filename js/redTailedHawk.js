function RedTailedHawk(color, size, weight, speed) {
    this.color = color;
    this.size = size;
    this.weight = weight;
    this.speed = speed;
    this.scientificName = 'Buteo jamaicensis';
    this.commonName = 'Red-Tailed Hawk';
    this.type = 'Bird'
    this.diet = 'Carnivore';
    this.avgLifeSpan = '21 years';

    //Reference: https://www.nationalgeographic.com/animals/birds/r/red-tailed-hawk/
    if (this.size.toLowerCase() === 'small') {
        this.body = (Math.random() * 18.0) + 20.7;
        this.wingspan = (Math.random() * 38.0) + 39.7;
    } else if (this.size.toLowerCase() === 'medium') {
        this.body = (Math.random() * 20.8) + 23.4;
        this.wingspan = (Math.random() * 39.8) + 41.4;
    } else if (this.size.toLowerCase() === 'large') {
        this.body = (Math.random() * 23.5) + 26.0;
        this.wingspan = (Math.random() * 41.5) + 43.0;
    }

    if (this.weight.toLowerCase() === 'light') {
        this.massStandard = (Math.random() * 24.3) + 33.4;
        this.massMetric;
    } else if (this.weight.toLowerCase() === 'normal') {
        this.massStandard = (Math.random() * 33.5) + 42.5;
        this.massMetric;
    } else if (this.weight.toLowerCase() === 'heavy') {
        this.massStandard = (Math.random() * 42.6) + 51.5;
        this.massMetric;
    }

    if (this.speed.toLowerCase() === 'slow') {
        this.speedMPH;
        this.speedKPH;
    } else if (this.speed.toLowerCase() === 'fast') {
        this.speedMPH;
        this.speedKPH;
    } else {
        this.speedMPH;
        this.speedKPH;
    }
}