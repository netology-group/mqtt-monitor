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

  static addSubscriptions(session, subscriptions) {
    return _.update(session, ['subscriptions'], currentSubscriptions => {
      const diff = _.differenceBy(subscriptions, currentSubscriptions, this._compareSubscriptions);
      return _.concat(currentSubscriptions, diff);
    });
  }

  static removeSubscriptions(session, subscriptions) {
    return _.update(session, ['subscriptions'], currentSubscriptions => {
      return _.differenceBy(currentSubscriptions, subscriptions, this._compareSubscriptions);
    });
  }

  static _compareSubscriptions(a, b) {
    return _.isEqual(a && a.topic, b && b.topic);
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
