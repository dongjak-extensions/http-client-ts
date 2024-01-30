
const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const readFileAsync = promisify(fs.readFile)
const TEMPLATE_DIR = path.join(__dirname, 'templates')

module.exports = {
  branches: ["master"],
  plugins: [
    [
      'semantic-release-gitmoji', {
      releaseRules: {
        major: [
          ':boom:'
        ],
        premajor: [],
        minor: [
          ':sparkles:'
        ],
        preminor: [],
        patch: [
          ':bug:',
          ':ambulance:',
          ':lock:'
        ],
        prepatch: [],
        prerelease: []
      },
      releaseNotes: {
        semver: false,
        template: readFileAsync(path.join(TEMPLATE_DIR, 'default-template.hbs')),
        partials: {
          commitTemplate: readFileAsync(path.join(TEMPLATE_DIR, 'commit-template.hbs'))
        },
        issueResolution: {
          // template
          // baseUrl
          // source
          // removeFromCommit
          // regex
        }
      }
    }
    ],
    '@semantic-release/github',
    "@semantic-release/npm",
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["package.json", "CHANGELOG.md"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
}
