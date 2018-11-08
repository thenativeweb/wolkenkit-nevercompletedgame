import classNames from 'classnames';
import React from 'react';

import styles from './App.css';
import successWav from '../../static/success.wav';

import { Icon, Product } from 'thenativeweb-ux';

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
    const answerStyles = classNames(styles.Answer, {
      [styles['Answer--Wrong']]: this.state.isAnswerWrong,
      [styles['Answer--Correct']]: this.state.isAnswerCorrect
    });

    const overlayStyles = classNames(styles.Overlay, {
      [styles['Overlay--Hidden']]: !this.state.isCompleted
    });

    return (
      <div className={ styles.FullScreen }>
        <div className={ overlayStyles }>
          Herzlichen Glückwunsch!
        </div>

        <div className={ styles.Shell }>
          <div className={ styles.Highscore }>
            <div className={ styles.Highscore__Title }>Highscore</div>
            <div className={ styles.Highscore__Value }>{this.state.highscore}</div>
          </div>
          <div className={ styles.Content__Container }>
            <div className={ styles.Content }>
              <div className={ styles.Level }>
                <div className={ styles.Level__Number }>{this.state.level}</div>
              </div>
              <div className={ styles.Question }>{this.state.question}</div>
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
                  /> <button className={ styles.Submit }><i className='fa fa-paper-plane' /></button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className={ styles.Sidebar }>
          <div className={ styles.Description }>
            <p>
              This is a wolkenkit implementation
              of <a href='https://www.nevercompletedgame.com/' target='_blank' rel='noopener noreferrer'>nevercompletedgame.com</a>.
            </p>
            <p>
              Its purpose is being a sample application for learning domain-driven design, event-sourcing and CQRS.
            </p>
            <p>
              Have a look at the <a href='https://github.com/thenativeweb/wolkenkit-nevercompletedgame'>source code on GitHub</a>.
            </p>
          </div>
          <div className={ styles.PoweredBy }>
            <div>Powered by</div>
            <div><a href='https://www.wolkenkit.io'><Product name='wolkenkit' size='m' /></a></div>
            <div className={ styles.Sponsors }>
              Made with <Icon name='heart' color='highlight' size='xs' type='inline' /> by <a className={ styles.Sponsor } href='https://www.thenativeweb.io'>the native web</a>.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
