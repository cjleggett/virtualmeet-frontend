import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 'auto',
    bottom: 0,
    marginTop: 50,
  }
}))

export default function Footer() {
  const classes = useStyles();

  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      <Toolbar>
        <p>Have questions or suggestions? Let me know at <a href="mailto:cjleggett@college.harvard.edu">{" cjleggett@college.harvard.edu"}</a></p>
      </Toolbar>
    </AppBar>
  );
}