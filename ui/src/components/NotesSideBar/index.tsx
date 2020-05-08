import React from 'react';
import { useQuery } from '@apollo/client';

import styles from './styles.scss';
import { LIST_NOTES_QUERY, ListVars, ListData, Note } from '../../apollo-client/notes';

export interface Props {}

export default function NotesSideBar(_props: Props): JSX.Element {
  const { loading, error, data } = useQuery<ListData, ListVars>(LIST_NOTES_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`error: ${error.message}`}</p>;
  if (!data || data.notes.length === 0) return <p>No notes</p>;

  return (
    <div className={styles.container}>
      {data.notes.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}

export interface NoteCardProps {
  note: Note;
}

function NoteCard(props: NoteCardProps): JSX.Element {
  const { note } = props;

  return (
    <div className={styles.cardContainer}>
      <h3> {note.title} </h3>
      <div>{note.content}</div>
    </div>
  );
}
