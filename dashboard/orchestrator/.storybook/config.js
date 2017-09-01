import { configure } from '@kadira/storybook';
const req = require.context('../src/components', true, /\.stories\.js$/)
import '../src/styles/app.scss'

function loadStories() {
  req.keys().forEach(path => req(path))
}

configure(loadStories, module);
