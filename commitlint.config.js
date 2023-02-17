module.exports = {
  extends: ['@commitlint/config-conventional'],
  // Override a few specific rules
  rules: {
    'subject-case': [2, 'always', ['sentence-case']],
    'type-case': [2, 'always', 'sentence-case'],
    'type-enum': [
      2,
      'always',
      ['Build', 'Chore', 'CI', 'Docs', 'Feat', 'Fix', 'Perf', 'Refactor', 'Revert', 'Style', 'Test'],
    ],
  },
}
