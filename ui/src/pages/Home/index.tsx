import React from 'react';

import NotesSideBar from '../../components/NotesSideBar';
import Editor from '../../components/Editor';
import styles from './styles.scss';

export default function Home(): JSX.Element {
  return (
    <div className={styles.container} data-tid="container">
      <NotesSideBar />
      <div className={styles.editor}>
        <Editor />
      </div>
    </div>
  );
}
