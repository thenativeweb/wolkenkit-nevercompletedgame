'use strict';

const fields = {
  key: { initialState: '' },
  value: { initialState: 0 }
};

const when = {
  'playing.game.opened' (statistics, event, mark) {
    statistics.readOne({ where: { key: 'highscore' }}).
      failed(() => {
        statistics.add({ key: 'highscore' });
        mark.asDone();
      }).
      finished(() => {
        mark.asDone();
      });
  },

  'playing.game.succeeded' (statistics, event, mark) {
    statistics.update({
      where: { key: 'highscore', value: { $lessThan: event.data.level }},
      set: { value: event.data.level }
    });
    mark.asDone();
  }
};

module.exports = { fields, when };
