import classNames from 'classnames';
import injectSheet from 'react-jss';
import React from 'react';
import Sidebar from './Sidebar.jsx';
import styles from './App.styles.js';

import successWav from '../../static/success.wav';

class App extends React.Component {
  static handleError (err) {
    /* eslint-disable no-console */
    console.error(err);
    /* eslint-enable no-console */
  }

  constructor () {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      gameId: 0,
      highscore: 0,
      level: 0,
      question: '',
      answer: '',
      isAnswerWrong: false,
      isCompleted: false
    };
  }

  componentDidMount () {
    this.getGameId((err, gameId) => {
      if (err) {
        return App.handleError(err);
      }

      this.setState({ gameId });

      this.props.api.lists.statistics.readAndObserve({ where: { key: 'highscore' }}).
        updated(statistics => {
          const highscore = statistics[0].value;

          this.setState({ highscore });
        }).
        failed(App.handleError);

      this.props.api.lists.games.readAndObserve({ where: { id: gameId }}).
        updated((games, cancel) => {
          cancel();

          const game = games[0];

          this.setState({
            level: game.level,
            question: game.question,
            isCompleted: game.isCompleted
          });
          this.input.focus();
        }).
        failed(App.handleError);
    });
  }

  getGameId (callback) {
    if (!callback) {
      throw new Error('Callback is missing.');
    }

    let gameId = window.sessionStorage.getItem('gameId');

    if (gameId) {
      return callback(null, gameId);
    }

    this.props.api.playing.game().open().
      await('opened', event => {
        gameId = event.aggregate.id;

        window.sessionStorage.setItem('gameId', gameId);
        callback(null, gameId);
      }).
      failed(err => callback(err));
  }

  handleChange (event) {
    this.setState({
      answer: event.target.value,
      isAnswerWrong: false
    });
  }

  handleSubmit (event) {
    event.preventDefault();

    const answer = this.state.answer;

    this.props.api.playing.game(this.state.gameId).guess({ answer }).
      await([ 'failed', 'succeeded' ], result => {
        switch (result.name) {
          case 'failed': {
            this.setState({ isAnswerWrong: true });
            break;
          }
          case 'succeeded': {
            this.setState({ isAnswerCorrect: true });

            const audio = new Audio(successWav);

            audio.play();

            setTimeout(() => {
              if (!result.data.nextLevel) {
                return this.setState({
                  isCompleted: true
                });
              }

              this.setState({
                level: result.data.nextLevel,
                question: result.data.nextQuestion,
                answer: '',
                isAnswerCorrect: false
              });
              this.input.focus();
            }, 2 * 1000);
            break;
          }
          default: {
            // Do nothing.
          }
        }
      }).
      failed(App.handleError);
  }

  render () {
    const { classes } = this.props;

    const answerStyles = classNames(classes.Answer, {
      [classes.AnswerIsWrong]: this.state.isAnswerWrong,
      [classes.AnswerIsCorrect]: this.state.isAnswerCorrect
    });

    const overlayStyles = classNames(classes.Overlay, {
      [classes.OverlayIsHidden]: !this.state.isCompleted
    });

    return (
      <div className={ classes.FullScreen }>
        <div className={ overlayStyles }>
          Herzlichen Glückwunsch!
        </div>

        <div className={ classes.Shell }>
          <div className={ classes.Highscore }>
            <div className={ classes.HighscoreTitle }>Highscore</div>
            <div className={ classes.HighscoreValue }>{this.state.highscore}</div>
          </div>
          <div className={ classes.ContentContainer }>
            <div className={ classes.Content }>
              <div className={ classes.Level }>
                {this.state.level}
              </div>
              <div className={ classes.Question }>{this.state.question}</div>
              <div className={ answerStyles }>
                <form onSubmit={ this.handleSubmit }>
                  <input
                    ref={ input => {
                      this.input = input;
                    } }
                    disabled={ this.state.isAnswerCorrect }
                    onChange={ this.handleChange }
                    type='text'
                    value={ this.state.answer }
                  /> <button className={ classes.AnswerSubmit }><i className='fa fa-paper-plane' /></button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    );
  }
}

export default injectSheet(styles)(App);
