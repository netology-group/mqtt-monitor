export default class Message {
  static build(payload, timestamp, qos, retain) {
    const json = JSON.parse(payload);
    const data = typeof(json.payload) === 'undefined' ? json : JSON.parse(json.payload);
    return { payload: data, timestamp, qos, retain };
  }
}
