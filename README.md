# Development Environment:

To run this project, you need NodeJS installed on your platform of choice. Visit [NodeJS](https://nodejs.org) for instructions on how to install Node.

Type `npm install` at the root level of the project to install node dependencies. This is required prior to trying to run the project.

# Run the Simulation:

Type 'npm start' to build and run the development version of the project. This should automatically open a browser pointed to [https://localhost:3000](https://localhost:3000) once the development server starts.

The page will reload changes made when you save your code.<br>
You will also see errors and warnings in the terminal where you ran `npm start`.

# Build the production version:

Create React App, the cli tool used to spawn this project, comes with a script to package and build the project. Type `npm run build` to do this. It will create a build directory that includes bundled CSS files, a JS bundle, and an index.html file. There will also be any assets included, such as images or model files. 

This folder can be hosted by any server as needed: it is all client side code.

# Run using Docker:

If you'd like, you can use docker to run a production version of this project. The relevant files are `Dockerfile`, `docker-compose.yml` and `index.js`. The dockerfile specifies the build and host needed and creates an image for it. The docker-compose file will set up the environment variables and copy in the needed files to run the application. Finally, `index.js` is a small ExpressJS server meant to host the build directory. 

Docker can take a bit to set up, depending on your environment. If you have it installed properly all that's needed is to type `docker-compose up` in the root directory.

The server is set up to only work with SSL, since SmartSparrow will only work with SSL. Certificates are not included and you will need to go through a service like [Let's Encrypt](https://letsencrypt.org/) to get them. 

The Dockerfile is expecting the certs to be in `./sslcerts` and to be called `privkey.pem` for the private key and `cert.pem` for the certificate. The filenames are in `index.js` towards the top. 

# Adding new assets (like models): 

Currently the only asset using a model is `GrassField.js`. The model was taken from an fbx file and converted to a gltf file using Facebook's [FBX2GLTF](https://github.com/facebookincubator/FBX2glTF) project.

We only have support for GLTF loading in the application, though ThreeJS has other loaders out there if something else is desired. To load a new asset and use it, you would go to the model where you want to use the asset and create a new loader, then use that loader to load the file you want, making sure to wrap it in a promise.

```
const loader = new THREE.GLTFLoader(new THREE.LoadingManager());

const myModel = new Promise((resolve, reject) => {
  loader.load(
    "models/mymodel.gltf",
    model => resolve(model.scene || null),
    undefined,
    reject
  );
});
```

At this point your model is ready to use, similar to how you would use other models. The complexity comes with managing multiple async operations and making sure the simulator waits for all of them to finish before loading. These are the ThreeJS Docs used for the [GLTFLoader](https://threejs.org/docs/#examples/loaders/GLTFLoader).