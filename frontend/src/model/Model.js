const UPDATE_EVENT = 'update';

export default class Model extends EventTarget {
  constructor(data) {
    super();
    this.data = data;
    this.callbacks = {};
  }

  update(dataDiff) {
    this.data = {...this.data, ...dataDiff};
    this.dispatchEvent(new Event(UPDATE_EVENT));
  }

  onUpdate(callback) {
    this.callbacks[callback] = () => callback(this.data);
    this.addEventListener(UPDATE_EVENT, this.callbacks[callback]);
  }

  removeOnUpdate(callback) {
    this.removeEventListener(UPDATE_EVENT, this.callbacks[callback]);
  }
}
