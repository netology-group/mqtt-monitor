import Model from './Model';
import Message from './Message';

export default class Topic extends Model {
  constructor(topic) {
    super({ topic, messages: [] });
  }

  addMessage(message, offline) {
    const messageModel = new Message(
      message.payload,
      message.timestamp,
      message.qos,
      message.retain,
      offline
    );

    this.update({ messages: [messageModel, ...this.data.messages] });
  }
}
