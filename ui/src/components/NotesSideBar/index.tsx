import React from 'react';
import { useQuery } from '@apollo/client';

import styles from './styles.scss';
import { Note, LIST_NOTES_QUERY, ListParams } from '../../apollo-client/notes';

export interface Props {}

export default function NotesSideBar(_props: Props): JSX.Element {
  const { loading, error, data } = useQuery<Note[], ListParams>(LIST_NOTES_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`error: ${error.message}`}</p>;

  console.log(data);

  return (
    <div className={styles.container} data-tid="container">
      <p>Notes Side Bar</p>
    </div>
  );
}
