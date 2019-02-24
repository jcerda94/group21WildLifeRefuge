//var count = 0;
class EventObserver {
  constructor() {
    this.observers = [];
  }
 
  subscribe(fn) {
    //console.log("Subscribe count = " + count++);
    this.observers.push(fn);
  }

  unsubscribe(fn) {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  broadcast(data) {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}

const hawkObserver = new EventObserver();
//export default hawkObserver;
export const getHawkObserver = () => {
    return hawkObserver;
  };
  
