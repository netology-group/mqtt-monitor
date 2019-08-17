import _ from 'lodash';
import Topic from './Topic';

export default class Session {
  static build(clientId) {
    return {
      clientId,
      publishes: [],
      subscriptions: [],
      online: true,
    };
  }

  static toggleOnline(session, value) {
    return _.set(session, ['online'], value);
  }

  static addSubscriptions(session, topics) {
    return _.update(session, ['subscriptions'], subscriptions => {
      return _.concat(subscriptions, topics.map(t => Topic.build(t)));
    });
  }

  static removeSubscriptions(session, topics) {
    return _.update(session, ['subscriptions'], subscriptions => {
      return _.reject(subscriptions, s => {
        return this._findTopicIndex(topics, s.topic) !== -1;
      });
    });
  }

  static updatePublishTopic(session, topic, updater) {
    return this._updateTopic(session, 'publishes', topic, updater);
  }

  static updateSubscriptionTopic(session, topic, updater) {
    return this._updateTopic(session, 'subscriptions', topic, updater);
  }

  static _updateTopic(session, key, topic, updater) {
    const idx = this._findTopicIndex(session[key], topic);

    if (idx === -1) {
      return _.update(session, [key], topics => [...topics, updater(Topic.build(topic))]);
    } else {
      return _.update(session, [key, topic, idx], updater);
    }
  }

  static _findTopicIndex(topics, topic) {
    return _.findIndex(topics, t => _.isEqual(t.topic, topic));
  }
}
