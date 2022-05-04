# puppeteer-test

Automated script that downloads every repo from a GitHub organization or user

## Running script

You'll need to open src/index.ts and replace `const reposUrl = 'https://github.com/nstseek/repositories';` with `const reposUrl = <your desired repositories url here>;`

Then you'll need to run yarn && yarn start (or npm i && npm start if you prefer)

You will need to be authenticated in your local Chrome browser with your user if the repos are private because this script will use your local Chrome data
