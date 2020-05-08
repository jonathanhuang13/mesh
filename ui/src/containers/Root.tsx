import React from 'react';
import { HashRouter, Link, Switch, Route, RouteProps } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { ApolloProvider, ApolloClient, NormalizedCacheObject } from '@apollo/client';

import routes from '../constants/routes';
import HomePage from './HomePage';
import EditorPage from './EditorPage';

type Props = {
  client: ApolloClient<NormalizedCacheObject>;
};

function About(_: RouteProps): JSX.Element {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Root(props: Props): JSX.Element {
  return (
    <ApolloProvider client={props.client}>
      <HashRouter>
        <div>
          <ul>
            <li>
              <Link to={routes.HOME}>Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to={routes.EDITOR}>Editor</Link>
            </li>
          </ul>

          <hr />
          <Switch>
            <Route exact path={routes.HOME} component={HomePage} />
            <Route path="/about" component={About} />
            <Route path={routes.EDITOR} component={EditorPage} />
          </Switch>
        </div>
      </HashRouter>
    </ApolloProvider>
  );
}

export default hot(Root);
