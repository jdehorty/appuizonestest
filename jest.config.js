/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    "ts-jest": {
      packageJson: "package.json"
    },
  },
};