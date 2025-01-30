const slackifyMarkdown = require('slackify-markdown');
const fs = require('fs');
const path = require('path');


const changelogPath = path.join(__dirname, '../CHANGELOG.md');
const CHANGELOG = fs.readFileSync(changelogPath, 'utf8');

const message = slackifyMarkdown(CHANGELOG);

function splitStringifiedJSON(jsonObject, maxLength = 3000, splitChar = '•') {
  const jsonString = JSON.stringify(jsonObject);
  if (jsonString.length <= maxLength) {
    return [jsonString];
  }

  const sections = [];
  let currentSection = '';
  const parts = jsonString.split(splitChar);

  parts.forEach((part, index) => {
    const addition = (index > 0 ? splitChar : '') + part;
    if ((currentSection + addition).length > maxLength) {
      sections.push(currentSection);
      currentSection = addition;
    } else {
      currentSection += addition;
    }
  });

  if (currentSection.trim()) {
    sections.push(currentSection);
  }

  return sections;
}

const sections = splitStringifiedJSON(message);

const resultOG = {
  "blocks": [
    {
      "type": "section",
      "fields": [
        {
          "type": "plain_text",
          "text": "New version of Ricos has been released!"
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": JSON.stringify(slackifyMarkdown(CHANGELOG))
      }
    }
  ]
}


const result = {
  blocks: [
    {
      type: 'section',
      fields: [
        {
          type: 'plain_text',
          text: 'New version of Ricos has been released!',
        },
      ],
    },
    ...sections.map(section => {
      return {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: section,
        },
      };
    }),
  ],
}

console.log(JSON.stringify(resultOG, null, 2));
console.log('-------------------');
console.log(JSON.stringify(result, null, 2));



// console.log(slackifyMarkdown(changelog));