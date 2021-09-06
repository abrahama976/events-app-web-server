const AppConfig = require('../app.config');
const appConfig = new AppConfig();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const {renderError} = require('../helpers/error-handler.helper');

const apiServer = process.env.API_SERVER;

/* GET home page. */
router.get('/', async (req, res) => {
  let events;
  let version;
  let team;
  try {
    const response = await axios.get(`${apiServer}/api/events`);
    events = response.data.events;
    const srvConfigResponse = await axios.get(`${apiServer}/api/config`);
    version = srvConfigResponse.data.config.version;
    team = srvConfigResponse.data.config.team;
    res.render('events',{
      layout: 'home',
      events: events,
      team: team,
      apiVersion: version,
      uiVersion: appConfig.version
    });
  } catch (e) {
    console.log('get / Error: ', e.message);
    renderError(res, e);
  }
});

router.post('/event', async(req, res) => {
  try {
    await axios.post(`${apiServer}/api/event`, req.body);
    res.redirect('/');
  } catch (e) {
    console.log('Post /event Error: ', e.message);
    renderError(res, e);
  }
});

module.exports = router;
