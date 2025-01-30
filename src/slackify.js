const slackifyMarkdown = require('slackify-markdown');
const fs = require('fs');
const path = require('path');


const changelogPath = path.join(__dirname, '../CHANGELOG.md');
const CHANGELOG = fs.readFileSync(changelogPath, 'utf8');
const message = slackifyMarkdown(CHANGELOG);

function splitStringifiedMarkdown(markdown, maxLength = 3000) {
  if (markdown.length <= maxLength) {
    return [markdown];
  }

  const sections = [];
  let currentSection = '';
  const parts = markdown.split(/\n/);

  parts.forEach((part, index) => {
    const addition = (index > 0 ? '\n' : '') + part;
    if ((currentSection + addition).length > maxLength) {
      sections.push(currentSection);
      currentSection = part;
    } else {
      currentSection += addition;
    }
  });

  if (currentSection.trim()) {
    sections.push(currentSection);
  }

  return sections;
}

const sections = splitStringifiedMarkdown(message);

const result = JSON.stringify({
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
});
console.log(result);
return result;

// console.log(slackifyMarkdown(changelog));