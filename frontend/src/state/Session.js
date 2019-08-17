import _ from 'lodash';
import Topic from './Topic';

export default class Session {
  static build(clientId) {
    return {
      clientId,
      publishes: [],
      delivers: [],
      subscriptions: [],
      online: true,
    };
  }

  static toggleOnline(session, value) {
    return _.set(session, ['online'], value);
  }

  static addSubscriptions(session, topics) {
    return _.update(session, ['subscriptions'], subscriptions => {
      return _.concat(subscriptions, topics);
    });
  }

  static removeSubscriptions(session, topics) {
    return _.update(session, ['subscriptions'], subscriptions => {
      return _.differenceBy(subscriptions, topics, _.isEqual);
    });
  }

  static updatePublishTopic(session, topic, updater) {
    return this._updateTopic(session, 'publishes', topic, updater);
  }

  static updateDeliverTopic(session, topic, updater) {
    return this._updateTopic(session, 'delivers', topic, updater);
  }

  static _updateTopic(session, key, topic, updater) {
    const idx = _.findIndex(session[key], t => _.isEqual(t.topic, topic));

    if (idx === -1) {
      return _.update(session, [key], topics => [...topics, updater(Topic.build(topic))]);
    } else {
      return _.update(session, [key, topic, idx], updater);
    }
  }
}
