'use strict';

const fields = {
  key: { initialState: '' },
  value: { initialState: 0 }
};

const projections = {
  async 'playing.game.opened' (statistics) {
    try {
      await statistics.readOne({ where: { key: 'highscore' }});
    } catch (ex) {
      statistics.add({ key: 'highscore' });
    }
  },

  'playing.game.succeeded' (statistics, event) {
    statistics.update({
      where: { key: 'highscore', value: { $lessThan: event.data.level }},
      set: { value: event.data.level }
    });
  }
};

module.exports = { fields, projections };
