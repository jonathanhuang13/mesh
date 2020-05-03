import React from 'react';
import { useSlate } from 'slate-react';

import { toggleMark, Format, isMarkActive } from '../../slatejs/mark';
import styles from './styles.css';

export interface Props {}

export default function Toolbar(_: Props): JSX.Element {
  return (
    <div className={styles.toolbar}>
      <MarkButton format={Format.Bold} />
    </div>
  );
}

export interface ButtonProps {
  format: Format;
}

function MarkButton(props: ButtonProps): JSX.Element {
  const editor = useSlate();
  const { format } = props;
  const isActive = isMarkActive(editor, format);

  const style = {
    backgroundColor: isActive ? 'black' : 'gray',
  };

  return (
    <button
      className={styles.button}
      style={style}
      type="button"
      onClick={() => toggleMark(editor, format)}
    />
  );
}
