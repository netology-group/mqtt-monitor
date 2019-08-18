import _ from 'lodash';

import Model from './Model';
import Topic from './Topic';

export default class Session extends Model {
  static _compareSubscriptions(a, b) {
    return _.isEqual(a && a.topic, b && b.topic);
  }

  constructor(clientId) {
    super({
      clientId,
      publishes: [],
      delivers: [],
      subscriptions: [],
      online: true
    });
  }

  toggleOnline(online) {
    if (online !== this.data.online) this.update({ online });
  }

  addSubscriptions(subscriptions) {
    const diff = _.differenceWith(subscriptions, this.data.subscriptions, Session._compareSubscriptions);
    if (!_.isEmpty(diff)) this.update({ subscriptions: [...this.data.subscriptions, ...diff] });
  }

  removeSubscriptions(subscriptions) {
    const newSubscriptions = _.differenceWith(
      this.data.subscriptions,
      subscriptions,
      Session._compareSubscriptions
    );

    if (newSubscriptions.length === this.data.subscriptions.length) return;
    this.update({ subscriptions: newSubscriptions });
  }

  findOrAddPublishTopic(topic) {
    return this._findOrAddTopic('publishes', topic);
  }

  findOrAddDeliverTopic(topic) {
    return this._findOrAddTopic('delivers', topic);
  }

  _findOrAddTopic(key, topic) {
    const idx = _.findIndex(this.data[key], t => _.isEqual(t.data.topic, topic));

    if (idx === -1) {
      const topicModel = new Topic(topic);
      this.update({ [key]: [...this.data[key], topicModel] });
      return topicModel;
    } else {
      return this.data[key][idx];
    }
  }
}
