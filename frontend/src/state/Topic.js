import _ from 'lodash';
import Message from './Message';

export default class Topic {
  static build(topic) {
    return { topic, messages: [] };
  }

  static addMessage(topic, message) {
    const msg = Message.build(message.payload, message.timestamp, message.qos, message.retain);
    return _.update(topic, ['messages'], messages => [msg, ...messages]);
  }
}
