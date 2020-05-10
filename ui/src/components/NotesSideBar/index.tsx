import React from 'react';

import styles from './styles.scss';
import { Note } from '../../apollo-client/notes';

export interface Props {
  notes: Note[];
  selectNote: (note: Note) => void;
}

export default function NotesSideBar(props: Props): JSX.Element {
  const { notes, selectNote } = props;

  return (
    <div className={styles.container}>
      {notes.map(note => (
        <NoteCard key={note.id} note={note} selectNote={selectNote} />
      ))}
    </div>
  );
}

export interface NoteCardProps {
  note: Note;
  selectNote: (note: Note) => void;
}

function NoteCard(props: NoteCardProps): JSX.Element {
  const { note, selectNote } = props;

  return (
    <div className={styles.cardContainer} onClick={() => selectNote(note)}>
      <h3> {note.title} </h3>
      <div>{note.content}</div>
    </div>
  );
}
