import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from '@material-ui/icons/Delete';
import AddEntry from "./AddEntry";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import EntriesTable from "./EntriesTable";
import { reverseUnits } from "../helpers/enum";
import useTeam from "../hooks/TeamHook"
import { SERVER_URL } from "../helpers/constants";
import { useAuth } from "../contexts/AuthContext";



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
  eventInfo: {
    marginLeft: 25,
  },
}));

export default function EventCard({ event, invitedTeams, updateEntries, isCurrent }) {
  const classes = useStyles();
  const team = useTeam();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [open, setOpen] = useState(false);
  const [deleteDisabled, setDeleteDisabled] = useState(false)
  const entries = event.entries;
  const { getSession } = useAuth();


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    updateEntries();
    setDeleteDisabled(false)
  };

  const hasEntry = () => {
    const user = JSON.parse(localStorage.getItem("userData"))
    for (const entry of entries) {
      if (entry.user.first === user.first && entry.user.last === user.last) {
        return true
      }
    }
    return false
  }

  const deleteTime = () => {
    setDeleteDisabled(true)
    const user = JSON.parse(localStorage.getItem("userData"))
    for (const entry of entries) {
      if (entry.user.first === user.first && entry.user.last === user.last) {
        fetch(`${SERVER_URL}/entries/deleteEntry`, {
          credentials: "include",
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            sessionid: getSession(),
          },
          body: JSON.stringify({
            entryId: entry.id
          }),
        }).then(() => {
          updateEntries()
        })
      }
    }
  }

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
            { invitedTeams[team.team] && isCurrent &&
              <div>
                { hasEntry() && 
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    startIcon={<DeleteIcon />}
                    onClick={deleteTime}
                    disabled={deleteDisabled}
                  >
                    Delete My Time
                  </Button>
                }
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<AddIcon />}
                  onClick={handleOpen}
                >
                  Add My Time
                </Button>
              </div>
            }
          </Toolbar>
          <Typography className={classes.eventInfo} variant="h6">
            {`Distance: ${event.distance} ${
              reverseUnits[parseInt(event.units)]
            }`}
          </Typography>
          <Typography className={classes.eventInfo} variant="h6">
            {`Gender: ${event.gender}`}
          </Typography>
          <Typography className={classes.eventInfo}>
            <Box fontStyle="italic" fontWeight="fontWeightLight">
              *If you don't identify as a man or woman, feel free to submit your
              time for those events you feel most comfortable in!
            </Box>
          </Typography>
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
