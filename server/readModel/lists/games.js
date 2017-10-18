'use strict';

const fields = {
  level: { initialState: undefined },
  question: { initialState: undefined },
  isCompleted: { initialState: false }
};

const when = {
  'playing.game.opened' (games, event, mark) {
    games.add({
      level: event.data.level,
      question: event.data.question
    });
    mark.asDone();
  },

  'playing.game.succeeded' (games, event, mark) {
    games.update({
      where: { id: event.aggregate.id },
      set: {
        level: event.data.nextLevel,
        question: event.data.nextQuestion
      }
    });
    mark.asDone();
  },

  'playing.game.completed' (games, event, mark) {
    games.update({
      where: { id: event.aggregate.id },
      set: {
        isCompleted: true
      }
    });
    mark.asDone();
  }
};

module.exports = { fields, when };
