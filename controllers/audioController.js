const sql = require('mssql');

const { SEARCH_THUMB } = require('../utils/constants');

exports.getThumb = async (req, res) => {
  const { parent } = req.body;
  const request = new sql.Request();
  request.query(SEARCH_THUMB.replace('parentValue', parent), (err, data) => {
    if (err) {
      console.log('err', err);
      res.statusCode = 500;
      res.json(err);
    }
    console.log(data);
    const { recordset: audioList } = data;

    let output = {};
    for (let i = 0; i < audioList.length; i++) {
      const thumb = 'https://img.youtube.com/vi/videoId/mqdefault.jpg'.replace('videoId', audioList[i].videoId);
      output[audioList[i].id] = thumb;
    }
    res.json(output);
  });
};
