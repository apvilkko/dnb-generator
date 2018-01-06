import React, {Component} from 'react';
import Pattern from './components/Pattern';

class App extends Component {
  render() {
    const {store, actions} = this.props;
    return (
      <div>
        <header>
          <h1>Allen Arctor's jungle/drum & bass generator</h1>
        </header>
        <main>
          <button type="button" onClick={actions.newScene}>New</button>
          <Pattern store={store} />

        </main>
        <footer>
          <div>
            <h3>Version history</h3>
            <ul>
              <li>0.1: random chopped drumfunk amen breaks</li>
            </ul>
          </div>
          <a href="https://github.com/apvilkko/dnb-generator">github</a>
        </footer>
      </div>
    );
  }
}

export default App;