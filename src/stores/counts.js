'use strict';

const axios = require('axios');
const apiUrl = require('../config').apiUrl;

const counts = {
  get(dimension, opts) {
    const { startTime, endTime, resolution, filter } = opts;

    return axios
      .get(apiUrl + `/count/${dimension}/between/${startTime}/${endTime}?resolution=${resolution}&filter=${filter}`)
      .then(parse);

    function parse(res) {
      return { dimension, data: res.data };
    }
  }
};

module.exports = counts;
