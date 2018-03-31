'use strict';

const fields = {
  level: { initialState: undefined },
  question: { initialState: undefined },
  isCompleted: { initialState: false }
};

const when = {
  'playing.game.opened' (games, event) {
    games.add({
      level: event.data.level,
      question: event.data.question
    });
  },

  'playing.game.succeeded' (games, event) {
    games.update({
      where: { id: event.aggregate.id },
      set: {
        level: event.data.nextLevel,
        question: event.data.nextQuestion
      }
    });
  },

  'playing.game.completed' (games, event) {
    games.update({
      where: { id: event.aggregate.id },
      set: {
        isCompleted: true
      }
    });
  }
};

module.exports = { fields, when };
