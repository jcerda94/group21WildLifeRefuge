function WesternRedCedar() {
    this.age;
    this.diameter;
    this.height;
    this.size;
    this.scientificName = 'Thuja plicata';
    this.commonName = 'Western Red Cedar';

    if (this.size.toLowerCase() === 'small') {
        this.height = (Math.random() * 65.0) + 66.7;
        this.diameter = (Math.random() * 3.0) + 3.3;
    } else if (this.size.toLowerCase() === 'medium') {
        this.height = (Math.random() * 66.8) + 68.5;
        this.diameter = (Math.random() * 3.4) + 3.7;
    } else if (this.size.toLowerCase() === 'large') {
        this.height = (Math.random() * 68.6) + 70;
        this.diameter = (Math.random() * 3.8) + 4.0;
    }
}