# vue3-voterhub

This project is an app containing all information for voters in philadelphia, based off a remake of atlas.phila.gov using [Vue 3](https://vuejs.org/guide/introduction.html).  Most of the vue files are written using the Vue3 Composition API.


## Project Setup

Your environment should be node 20.x and npm 10.x

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

create an .env.local file and add the following:

VITE_PUBLICPATH=/ - this is needed for accessing images in the public folder
VITE_DEBUG=true - this will allow many console.logs to show in your dev envt
VITE_VERSION=atlas - switch this to cityatlas to see the cityatlas version of the app

### Other environmental variables for .env.local

A number of other environmental variables, for protected services, are needed for running Atlas.  See [https://phila.city/display/appdev/Atlas](https://phila.city/display/appdev/Atlas).


### Compile and Minify for Production



```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).
