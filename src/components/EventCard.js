import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import AddEntry from "./AddEntry";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import EntriesTable from "./EntriesTable";
import { SERVER_URL } from "../helpers/constants";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    margin: 20,
  },
  cardContent: {
    flexGrow: 1,
  },
  explanation: {
    textAlign: "center",
    paddingBottom: 10,
  },
  spacer: {
    flexGrow: 1,
  },
  button: {
    margin: 5,
  },
  title: {
    margin: 10,
  },
  entry: {
    margin: 200,
  },
}));

export default function EventCard({ event, invitedTeams }) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState();

  function reloadEntries() {
    fetch(`${SERVER_URL}/entries/event/${event.id}`, {
      credentials: "include",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEntries(data);
      });
  }

  useEffect(() => {
    if (entries) {
      return;
    }
    reloadEntries();
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reloadEntries();
    setOpen(false);
  };

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Toolbar>
            <Typography className={classes.spacer} variant="h4">
              {event.name}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<AddIcon />}
              onClick={handleOpen}
            >
              Add My Time
            </Button>
          </Toolbar>
          {entries && (
            <div>
              {entries.length > 0 ? (
                <EntriesTable entries={entries} invitedTeams={invitedTeams} />
              ) : (
                <Typography>No Entries Yet</Typography>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Modal
        open={open}
        handleClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ClickAwayListener onClickAway={handleClose}>
          <div style={getModalStyle()} className={classes.paper}>
            <AddEntry
              className={classes.entry}
              event={event}
              handleClose={handleClose}
            />
          </div>
        </ClickAwayListener>
      </Modal>
    </div>
  );
}
