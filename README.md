# Setup:

### Windows:
- Clone the repo to your device
- From the root of the project directory run `npm install`
- Then run `npm start` to compile the project and launch the development server

### Mac OSX:
- Clone the repo to your device
- Inside of `package.json` change the line `"start": "set HTTPS=true&&PORT=3000 react-scripts start" ` ->  `"start": "export HTTPS=true&&react-scripts start"`
- From the root of the project directory run `./MacInstall.sh` to install and run the project
- For all subsequent launches, run `npm start` to compile the project and launch the development server


# Use:

### Run npm start to start the development server
Open [https://localhost:3000](https://localhost:3000) to view it in the browser.

The page will reload changes made when you save your code.<br>
You will also see any lint errors in the console.

# SPR Use/Testing:

Open the SPR Author and put [https://localhost:3000](https://localhost:3000) as the source url for a Blank Component. Then all authoring tools should preliminarily work. (Make sure use put https and not http, it will not work otherwise)

## Demo:
![Short SPR Demo](http://g.recordit.co/RkcyqPE0EZ.gif)
