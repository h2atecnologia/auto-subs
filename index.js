#!/usr/bin/env node

'use strict';

const fs = require('fs');
const OS = require('opensubtitles-api');
const program = require('commander');
const chalk = require('chalk');
const http = require('http');
const inquirer = require('inquirer');
const _ = require('lodash');

// This seems to be working o_O
const useragent = 'Butter v1';

const openSubtitles = new OS({
  useragent,
});


program
  .version('0.0.1')
  .option('-f, --file [value]', 'File name')
  .option('-l, --lang [value]', 'Subtitles languages', 'en')
  .parse(process.argv);

const programLang = program.lang;

function findSubs(fileName, lang) {
  if (!fileName) {
    console.log('No file given or found');
    return;
  }

  console.log(`Loading subtitles for ${chalk.green(fileName)} in language ${chalk.green(lang.toUpperCase())}`);


  openSubtitles.login().then(() => {
    openSubtitles.search({
      sublanguageid: lang,
      path: fileName,
      filename: fileName,
      limit: 5,
    }).then((subs) => {
      const langSubs = subs[lang];
      if (!langSubs || !langSubs.length) {
        console.log('No subtitles available for desired language');
        return;
      }

      inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: `There is ${subs[lang].length} options. Wich one do you choose ?`,
        choices: _.sortBy(langSubs, sub => -sub.score).map((it, idx) => ({ name: `${it.filename}\t\tScore ${it.score}`, value: idx })),
      }).then(({ choice }) => {
        const sub = langSubs[choice];

        const srtName = `${fileName.replace(/\.[^/.]+$/, '')}.srt`;

        const file = fs.createWriteStream(srtName);
        http.get(sub.url, (response) => {
          console.log(`Downloaded ${chalk.green(srtName)}`);
          response.pipe(file);
        });
      });
    });
  }).catch((err) => {
    console.error('Unable to contact API', err);
  });
}


function findFile(cb) {
  const files = fs.readdirSync('./').filter(file => fs.statSync(file).isFile() && file.match(/.*(\.mp4|\.avi|\.mpeg2|\.mkv)/g));

  inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: 'There is multiple video files in the folder - wich one do you choose ?',
    choices: files.map((it, idx) => ({ name: it, value: idx })),
  }).then(({ choice }) => {
    cb(files[choice], programLang);
  });
}

if (program.file) {
  const fileName = program.file;
  findSubs(fileName, programLang);
} else findFile(findSubs);
