export default class Message {
  static build(payload, timestamp, qos, retain, offline) {
    return {
      ...this._parsePayload(payload),
      timestamp: new Date(timestamp),
      qos,
      retain,
      offline
    };
  }

  static _parsePayload(payload) {
    try {
      const json = JSON.parse(payload);
      if (typeof(json.properties) !== 'object') throw(new Error('Expected object'));

      return {
        payloadType: 'svc-agent envelope',
        payload: JSON.parse(json.payload),
        properties: json.properties
      };
    } catch (_error) {
      return {
        payloadType: 'raw',
        payload,
        properties: {}
      };
    }
  }
}
