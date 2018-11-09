import injectSheet from 'react-jss';
import React from 'react';
import { Brand, ThemeProvider } from 'thenativeweb-ux';

const styles = {
  Sidebar: {
    flex: 'initial',
    width: '100%',
    'background-color': '#2f333b',
    'padding-top': '20px',
    'padding-bottom': '15px',
    'max-height': '30vh',
    'overflow-y': 'auto',

    '& div': {
      'padding-bottom': '5px'
    },

    '& a': {
      color: '#29abe2',
      'text-decoration': 'none'
    }
  },

  '@media only screen and (min-width: 768px)': {
    Sidebar: {
      display: 'flex',
      'flex-direction': 'column',
      width: '300px',
      'max-height': 'none',
      'justify-content': 'space-between'
    }
  },

  Description: {
    'padding-left': '25px',
    'padding-right': '25px',
    'font-size': '0.7em',
    'border-bottom': 'solid 1px rgba(255, 255, 255, 0.1)',
    'margin-bottom': '15px',

    '& p': {
      'margin-bottom': '10px'
    }
  },

  Sponsors: {
    'border-top': 'solid 1px rgba(255, 255, 255, 0.1)',
    'margin-top': '10px',
    'padding-top': '15px'
  }
};

const Sidebar = ({ classes }) => (
  <div className={ classes.Sidebar }>
    <div className={ classes.Description }>
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
    <div>
      <ThemeProvider theme='wolkenkit'>
        <Brand.PoweredBy product='wolkenkit' />
      </ThemeProvider>
      <div className={ classes.Sponsors }>
        <Brand.MadeBy />
      </div>
    </div>
  </div>
);

export default injectSheet(styles)(Sidebar);
