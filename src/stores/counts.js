'use strict';

const axios = require('axios');
const apiUrl = require('../config').apiUrl;

const counts = {
  get(dimension, opts) {
    const { startTime, endTime, resolution } = opts;

    return axios
      .get(apiUrl + `/count/${dimension}/between/${startTime}/${endTime}?resolution=${resolution}`)
      .then(parse);

    function parse(res) {
      return {
        dimension,
        data: res.data
      };
    }
  }
};

module.exports = counts;
