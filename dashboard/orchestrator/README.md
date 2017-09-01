# Orchestrator

**A nodes and smart contracts management app**.

![browser](https://raw.githubusercontent.com/uniquid/orchestrator/master/browser.png?token=ABxCod6826pRYDyvo37JmvnLj97wVhG0ks5ZLXKmwA%3D%3D)


## Getting Started

To run the app in development mode:

```
$ git clone https://github.com/uniquid/orchestrator.git
$ cd orchestrator
$ git checkout develop
$ npm install
$ npm start
```
Then open http://localhost:3000/ to see your app


## Features
Actually you can:
- Access the app through smartphone without type username/password
- See all the nodes you orchestrate accessing the Assect Directory page
- Create Orchestration contracts with nodes you have previously imprinted
- See & filter the nodes list inside the 'Office' context
- See & filter the contracts list inside the 'Office' context
- Create a new contract between two nodes inside the 'Office' context
- Revoke a contract previously made on the 'Office' context


## Testing
We are using Jest as main testing platform. Jest comes with Instanbul as code coverage analysis tool.
As testing ugilities we use enzyme, mostly to render components, containers and to test react lifecycle.
Plus, running ```$ npm run storybook``` inside the orchestrator folder, it will start the uniquid storybook at http://localhost:6006


## Prerequisities

You will need to have Node >= 4 on your machine and npm


## Built With

* [React](https://facebook.github.io/react/)
* [Redux](http://redux.js.org/)
* [Redux-Observable](https://redux-observable.js.org/)
* [Storybook](https://storybooks.js.org/)
* [Webpack](https://webpack.github.io/)
* [Jest](https://facebook.github.io/jest/)
* [Enzyme](https://github.com/airbnb/enzyme)


## Contributing
In order to report a bug, you can add a new issue [here](https://github.com/uniquid/orchestrator/issues) providing a detailed report of the UI/UX bugs or enhancements.
