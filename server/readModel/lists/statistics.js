'use strict';

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
    }).orUpdate({
      where: { key: 'highscore' },
      set: { key: 'highscore' }
    });
  },

  'playing.game.succeeded' (statistics, event) {
    statistics.update({
      where: { key: 'highscore', value: { $lessThan: event.data.level }},
      set: { value: event.data.level }
    });
  }
};

module.exports = { fields, projections };
