'use strict';

const { forPublic } = require('wolkenkit-application-tools');

const fields = {
  key: { initialState: '' },
  value: { initialState: 0 }
};

const projections = {
  async 'playing.game.opened' (statistics) {
    // If the highscore value is not yet present, add it. Otherwise, perform a
    // no-op update.
    statistics.add({
      key: 'highscore'
    }).orDiscard();
  },

  'playing.game.succeeded' (statistics, event) {
    statistics.update({
      where: { key: 'highscore', value: { $lessThan: event.data.level }},
      set: { value: event.data.level }
    });
  }
};

const queries = {
  readItem: {
    isAuthorized: forPublic()
  }
};

module.exports = { fields, projections, queries };
