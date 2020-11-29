const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { drive } = require('googleapis/build/src/apis/drive');
const { query } = require('express');

let auth;
const TOKEN_PATH = './config/token.json';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const startAuth = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./config/credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Drive API.
      getAuth(JSON.parse(content), resolve, reject);
    });
  });
};

function getAuth(credentials, resolve, reject) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    console.log('token', token);
    if (err) return getAccessToken(oAuth2Client);
    oAuth2Client.setCredentials(JSON.parse(token));
    console.log('oAuth2Client', oAuth2Client);
    auth = oAuth2Client;
    resolve();
  });
}

function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      auth = authoAuth2Client;
    });
  });
}

exports.uploadFile = async (req, res) => {
  var fileMetadata = {
    name: 'hotgirl', // file name that will be saved in google drive
  };

  var media = {
    mimeType: 'image/jpg',
    body: fs.createReadStream('images.jpg'), // Reading the file from our server
  };

  await startAuth();
  console.log('auth', auth);
  // Authenticating drive API
  const drive = google.drive({ version: 'v3', auth });

  // Uploading Single image to drive
  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
    },
    async (err, file) => {
      if (err) {
        // Handle error
        console.error(err.msg);

        return res
          .status(400)
          .json({ errors: [{ msg: 'Server Error try again later' }] });
      } else {
        // if file upload success then return the unique google drive id
        res.status(200).json({
          fileID: file.data.id,
        });
      }
    }
  );
};

const getAllItem = (drive, whatQuery) => {
  return new Promise((resolve, reject) => {
    const query = { q: whatQuery, spaces: 'drive' };

    drive.files.list(query, (err, res) => {
      if (err) {
        // Handle error
        reject(err);
      } else {
        resolve(res.data.files);
      }
    });
  });
};

const downloadFiles = (drive, id) => {
  console.log('id', id);

  return drive.files
    .get({ fileId: id, alt: 'media' }, { responseType: 'stream' })
    .then((res) => {
      return new Promise((resolve, reject) => {
        const filePath = './resource/test.mp3';
        console.log(`writing to ${filePath}`);
        const dest = fs.createWriteStream(filePath);
        let progress = 0;

        res.data
          .on('end', () => {
            console.log('Done downloading file.');
            resolve(filePath);
          })
          .on('error', (err) => {
            console.error('Error downloading file.');
            reject(err);
          })
          .on('data', (d) => {
            progress += d.length;
            if (process.stdout.isTTY) {
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(`Downloaded ${progress} bytes`);
            }
          })
          .pipe(dest);
      });
    });
};

exports.getAllAudioBook = async (req, res) => {
  const { searchTxt } = req.body;
  console.log('searchTxt', searchTxt);

  try {
    await startAuth();
    const drive = google.drive({ version: 'v3', auth });
    const folders = await getAllItem(
      drive,
      "mimeType = 'application/vnd.google-apps.folder'",
      searchTxt
    );
    const newFolders = folders.map((item) => {
      return { id: item.id, name: item.name };
    });
    const filter = newFolders.filter((item) => item.name.includes(searchTxt));

    res.json({ data: filter, totalRecord: filter.length });
  } catch (err) {
    res.statusCode = 500;
    res.json(err);
  }
};

exports.getAudioBook = async (req, res) => {
  const { id } = req.body;

  try {
    await startAuth();
    const drive = google.drive({ version: 'v3', auth });
    const query = "'idValue' in parents".replace('idValue', id);
    console.log('query', query);
    const folders = await getAllItem(drive, query);
    const newFolders = folders.map((item) => {
      return {
        name: item.name,
        url: `https://docs.google.com/uc?export=download&id=${item.id}`,
      };
    });
    res.json({ data: newFolders, id });
  } catch (err) {
    res.statusCode = 500;
    res.json(err);
  }
};
