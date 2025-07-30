import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './TextEditor.css';

const TextEditor = ({ value, onChange }) => {
  return (
    <div className='text-editor'>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data); 
        }}
      />
    </div>
  );
};

export default TextEditor;
