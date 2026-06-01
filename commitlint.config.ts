const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'style',
        'docs',
        'test',
        'chore',
        'build',
        'ci',
        'perf',
      ],
    ],
    'subject-case': [0],
  },
}

export default config
