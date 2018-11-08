const styles = {
  '@global': {
    '*': {
      margin: 0,
      padding: 0,
      'box-sizing': 'border-box'
    }
  },

  '@keyframes shake': {
    from: {},
    to: {
      transform: 'translate3d(0, 0, 0)'
    },

    '10%, 30%, 50%, 70%, 90%': {
      transform: 'translate3d(-10px, 0, 0)'
    },

    '20%, 40%, 60%, 80%': {
      transform: 'translate3d(10px, 0, 0)'
    }
  },

  FullScreen: {
    display: 'flex',
    'flex-direction': 'column',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    'background-color': '#000',
    color: '#fff',
    'font-family': '"Source Sans Pro", sans-serif',
    'font-weight': 300,
    'font-size': '25px',
    overflow: 'hidden'
  },

  Overlay: {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    'background-color': '#000',
    opacity: 0.8,
    visibility: 'visible',
    'z-index': 1,
    transition: 'opacity 0.3s, visibility 0.3s',
    'font-size': '2.5em',
    color: '#fff',
    'text-align': 'center'
  },

  OverlayIsHidden: {
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.3s, visibility 0.3s'
  },

  '@media (min-width: 768px)': {
    FullScreen: {
      'flex-direction': 'row'
    },

    Overlay: {
      'font-size': '3em'
    }
  },

  Shell: {
    flex: 1,
    display: 'flex',
    'flex-direction': 'column',
    'justify-content': 'flex-start'
  },

  Highscore: {
    flex: 'initial',
    width: '100px',
    height: '100px',
    display: 'flex',
    'flex-direction': 'column',
    'justify-content': 'center',
    'align-items': 'center'
  },

  HighscoreTitle: {
    'font-size': '0.7em'
  },

  HighscoreValue: {
    'font-family': '"Ubuntu", sans-serif',
    'font-weight': 400,
    'font-size': '1.5em'
  },

  ContentContainer: {
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    flex: 1
  },

  Content: {
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'space-between',
    'flex-direction': 'column',
    width: '80%'
  },

  Level: {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    flex: 'initial',
    'font-family': '"Ubuntu", sans-serif',
    'font-weight': 400,
    color: '#09f',
    border: '3px solid #09f',
    'border-radius': '50%',
    width: '50px',
    height: '50px'
  },

  Question: {
    flex: 1,
    'margin-top': '49px',
    'margin-bottom': '70px',
    'font-size': '0.8em',
    'text-align': 'center'
  },

  Answer: {
    flex: 'initial',
    'border-bottom': '3px solid #09f',
    'margin-bottom': '100px',
    color: '#09f',
    width: '95%',
    'max-width': '720px',

    '& input': {
      'background-color': '#000',
      color: 'inherit',
      'font-size': '1em',
      border: 'none',
      'text-align': 'center',
      padding: '7px',
      width: 'calc(100% - 32px)'
    },

    '& input:focus': {
      outline: 'none'
    }
  },

  AnswerIsWrong: {
    'border-bottom': '3px solid #f00',
    color: '#f00',
    'animation-duration': '1s',
    'animation-fill-mode': 'both',
    'animation-name': 'shake'
  },

  AnswerIsCorrect: {
    'border-bottom': '3px solid #0f0',
    color: '#0f0'
  },

  AnswerSubmit: {
    border: 'none',
    'background-color': '#000',
    color: 'inherit',
    cursor: 'pointer',
    'font-size': '1em'
  }
};

export default styles;
