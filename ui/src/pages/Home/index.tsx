import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

import { LIST_NOTES_QUERY, ListVars, ListData, Note } from '../../apollo-client/notes';
import NotesSideBar from '../../components/NotesSideBar';
import Editor from '../../components/Editor';
import styles from './styles.scss';

export default function Home(): JSX.Element {
  const [note, setNote] = useState<Note | null>(null);
  const { loading, error, data } = useQuery<ListData, ListVars>(LIST_NOTES_QUERY);

  function selectNote(selected: Note): void {
    setNote(selected);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`error: ${error.message}`}</p>;
  if (!data || data.notes.length === 0) return <p>No notes</p>;

  return (
    <div className={styles.container} data-tid="container">
      <NotesSideBar notes={data.notes} selectNote={selectNote} />
      <div className={styles.editor}>
        <Editor note={note} />
      </div>
    </div>
  );
}
