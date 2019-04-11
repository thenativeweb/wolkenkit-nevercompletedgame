'use strict';

const { forPublic, reject } = require('wolkenkit-application-tools');

const riddles = require('../../shared/riddles.json');

const initialState = {
  level: undefined,
  isCompleted: false
};

const commands = {
  open: {
    schema: {
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false
    },

    isAuthorized: forPublic(),

    handle (game, command) {
      reject(command).if(game).exists();

      const level = 1;
      const { question } = riddles[level - 1];

      game.events.publish('opened', { level, question });
    }
  },

  guess: {
    schema: {
      type: 'object',
      properties: {
        answer: { type: 'string', minLength: 0 }
      },
      required: [ 'answer' ]
    },

    isAuthorized: forPublic(),

    handle (game, command) {
      reject(command).if(game).doesNotExist();

      if (game.state.isCompleted) {
        return command.reject('Game has already been completed.');
      }

      const { level } = game.state;

      const guess = command.data.answer.trim().toLowerCase();
      const answer = riddles[level - 1].answer.toLowerCase();

      const isAnswerWrong = guess !== answer;

      if (isAnswerWrong) {
        game.events.publish('failed');

        return;
      }

      const nextLevel = level + 1;
      const hasNextLevel = level < riddles.length;

      if (!hasNextLevel) {
        game.events.publish('succeeded', { level });
        game.events.publish('completed');

        return;
      }

      const nextQuestion = riddles[nextLevel - 1].question;

      game.events.publish('succeeded', { level, nextLevel, nextQuestion });
    }
  }
};

const events = {
  opened: {
    schema: {
      type: 'object',
      properties: {
        level: { type: 'number', minimum: 1 },
        question: { type: 'string', minLength: 1 }
      },
      required: [ 'level', 'question' ],
      additionalProperties: false
    },

    handle (game, event) {
      game.setState({ level: event.data.level });
    },

    isAuthorized: forPublic()
  },

  succeeded: {
    schema: {
      type: 'object',
      properties: {
        level: { type: 'number', minimum: 1 },
        nextLevel: { type: 'number', minimum: 1 },
        nextQuestion: { type: 'string', minLength: 1 }
      },
      required: [ 'level', 'nextLevel', 'nextQuestion' ],
      additionalProperties: false
    },

    handle (game, event) {
      game.setState({ level: event.data.nextLevel });
    },

    isAuthorized: forPublic()
  },

  failed: {
    schema: {
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false
    },

    handle () {},

    isAuthorized: forPublic()
  },

  completed: {
    schema: {
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false
    },

    handle (game) {
      game.setState({ isCompleted: true });
    },

    isAuthorized: forPublic()
  }
};

module.exports = { initialState, commands, events };
