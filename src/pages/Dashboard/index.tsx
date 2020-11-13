/* eslint-disable no-octal */
import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import format from 'date-fns/format';

import SettingsIcon from '@material-ui/icons/Settings';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Paper } from '@material-ui/core';
import api from '../../services/api';

HighchartsMore(Highcharts);

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © 2020 '}
      <Link color="inherit" href="http://www.mosb.com.br/">
        www.mosb.com.br
      </Link>
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  containerDashBoard: {
    minHeight: '100%',
    background: theme.palette.background.paper,
  },
  drawer: {
    width: 240,
  },
  drawerPaper: {
    width: 240,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  appBarBottom: {
    top: 'auto',
    bottom: 0,
    width: 240,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const [OpenDrawer, setOpenDrawer] = useState(false);
  const [DateEfficiency, setDateEfficiency] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  );
  const [DataMachine, setDataMachine] = useState([]);

  useEffect(() => {
    loadDataMachine();
  }, []);

  async function loadDataMachine() {
    const responseMachine = api.post('/filter-date', {
      date: DateEfficiency,
      machine: 'machine002',
    });
  }

  function handleSaveSettings() {
    setOpenDrawer(false);
    loadDataMachine();
  }

  const options = {
    chart: {
      type: 'columnrange',
      inverted: true,
    },
    yAxis: {
      type: 'datetime',
    },

    xAxis: {
      categories: ['OP135848 - 1367370A 0 pçs', 'OP135848 - 1367370A 1 pçs'],
    },

    legend: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },

    series: [
      {
        name: 'Hours',
        data: DataMachine,
      },
    ],
  };

  return (
    <div className={classes.containerDashBoard}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            MOSB
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Grid container xs={12}>
          <Grid item xs={12}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Machine Efficiency
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </Grid>
        </Grid>
      </Container>
      <Drawer
        anchor="right"
        open={OpenDrawer}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Paper elevation={0} className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={DateEfficiency}
                label="Date"
                type="date"
                onChange={e => setDateEfficiency(e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
        <AppBar
          position="fixed"
          color="transparent"
          className={classes.appBarBottom}
        >
          <Toolbar>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => handleSaveSettings()}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
      </Drawer>
      <Fab
        color="secondary"
        className={classes.fab}
        aria-label="settings"
        onClick={() => setOpenDrawer(true)}
      >
        <SettingsIcon />
      </Fab>
      <footer className={classes.footer}>
        <Copyright />
      </footer>
    </div>
  );
};

export default Dashboard;
