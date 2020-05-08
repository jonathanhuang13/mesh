import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../../constants/routes';
import NotesSideBar from '../../components/NotesSideBar';
import styles from './styles.scss';

export default function Home(): JSX.Element {
  return (
    <div className={styles.container} data-tid="container">
      <h2>Home</h2>
      <NotesSideBar />
      <Link to={routes.EDITOR}>to Editor</Link>
    </div>
  );
}
