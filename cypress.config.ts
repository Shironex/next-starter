import { defineConfig } from 'cypress'
import { resolve } from 'path'

import task from './cypress/tasks'

export default defineConfig({
  projectId: 'xqxexj',
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    supportFile: 'cypress/support/components.ts',
  },
  e2e: {
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      task(on, config)

      on(
        'file:preprocessor',
        require('@cypress/webpack-preprocessor')({
          webpackOptions: {
            resolve: {
              extensions: ['.ts', '.js', '.json'],
              alias: {
                '@': resolve(__dirname, './src'),
              },
            },
            module: {
              rules: [
                {
                  test: /\.tsx?$/,
                  exclude: /node_modules/,
                  use: [
                    {
                      loader: 'babel-loader',
                      options: {
                        presets: [
                          '@babel/preset-env',
                          '@babel/preset-typescript',
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          },
        })
      )
    },
    env: {
      NODE_ENV: process.env.NODE_ENV,
      baseUrl: 'http://localhost:3000',
      DATABASE_URL: process.env.DATABASE_URL,
    },
    baseUrl: 'http://localhost:3000',
  },
})
