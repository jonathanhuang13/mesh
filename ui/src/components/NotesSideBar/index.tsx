import React from 'react';
import { useQuery, gql } from '@apollo/client';

import styles from './styles.scss';

export interface Props {}

const getNotesQuery = gql`
  query getNotes {
    notes {
      id
    }
  }
`;

export default function NotesSideBar(_props: Props): JSX.Element {
  const { loading, error, data } = useQuery(getNotesQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>error...</p>;

  console.log(data);

  return (
    <div className={styles.container} data-tid="container">
      <p>Notes Side Bar</p>
    </div>
  );
}
