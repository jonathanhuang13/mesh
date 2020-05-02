import React from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';

const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks,
});

export default class EditorPage extends React.Component {
  editorRef: any;
  view: EditorView;

  constructor(props: any) {
    super(props);
    this.editorRef = React.createRef();

    this.view = new EditorView(undefined, {
      state: EditorState.create({
        plugins: exampleSetup({ schema: mySchema }),
        schema: mySchema,
      }),
    });
  }

  componentDidMount() {
    this.editorRef.current.appendChild(this.view.dom);
  }

  render() {
    const editor = <div ref={this.editorRef} />;

    return editor;
  }
}
