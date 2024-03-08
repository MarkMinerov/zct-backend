## How to Launch? 🤔

1. Download & Install Docker from the official documentation
2. Start `start-app.sh` script to start the application
3. Open `http://localhost:5000` in your browser or just click [here](http://localhost:5000)
4. Start `end-app.sh` to kill the application. Also deletes all containers it has built for the app.

## Components 😏

1. **Tensorflow AI** model on a dedicated server *(trained using mnist dataset with conv2d, dropout, dense, activation layers)*
2. **React application** + **API system** based on `express.js` *(static server, dev/prod modes, .env file, etc)*
3. **MariaDB** with *automatic initialization* when *API server starts*

## How to use 🫨

Firstly, you have to **sign in** or **register** in the system using **top right buttons**, then click on `Draw` button and you will be able to draw a number on the canvas. Use `Submit` button to ask AI what number you just drew. Enjoy!😃