import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';

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
        <p>Have questions or suggestions? Let me know at <Link color="inherit" href="mailto:cjleggett@college.harvard.edu">{" cjleggett@college.harvard.edu"}</Link></p>
      </Toolbar>
    </AppBar>
  );
}