'use strict';

const { only } = require('wolkenkit-command-tools');

const riddles = require('../../shared/riddles.json');

const initialState = {
  level: undefined,
  isCompleted: false,
  isAuthorized: {
    commands: {
      open: { forPublic: true },
      guess: { forPublic: true }
    },
    events: {
      opened: { forPublic: true },
      succeeded: { forPublic: true },
      failed: { forPublic: true },
      completed: { forPublic: true }
    }
  }
};

const commands = {
  open: [
    only.ifNotExists(),
    (game, command, mark) => {
      const level = 1,
            question = riddles[level - 1].question;

      game.events.publish('opened', { level, question });
      mark.asDone();
    }
  ],

  guess: [
    only.ifExists(),
    only.ifValidatedBy({
      type: 'object',
      properties: {
        answer: { type: 'string', minLength: 0 }
      },
      required: [ 'answer' ]
    }),
    (game, command, mark) => {
      if (game.state.isCompleted) {
        return mark.asRejected('Game has already been completed.');
      }

      const level = game.state.level;
      const guess = command.data.answer.trim().toLowerCase();
      const answer = riddles[level - 1].answer.toLowerCase();

      const isAnswerWrong = guess !== answer;

      if (isAnswerWrong) {
        game.events.publish('failed');

        return mark.asDone();
      }

      const nextLevel = level + 1;
      const hasNextLevel = level < riddles.length;

      if (!hasNextLevel) {
        game.events.publish('succeeded', { level });
        game.events.publish('completed');

        return mark.asDone();
      }

      const nextQuestion = riddles[nextLevel - 1].question;

      game.events.publish('succeeded', { level, nextLevel, nextQuestion });
      mark.asDone();
    }
  ]
};

const events = {
  opened (game, event) {
    game.setState({ level: event.data.level });
  },

  succeeded (game, event) {
    game.setState({ level: event.data.nextLevel });
  },

  failed () {},

  completed (game) {
    game.setState({ isCompleted: true });
  }
};

module.exports = { initialState, commands, events };
