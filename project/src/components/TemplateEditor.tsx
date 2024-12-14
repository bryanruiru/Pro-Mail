import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { ChainedCommands } from '@tiptap/core';

interface TemplateEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TemplateEditor = ({ content, onChange }: TemplateEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg', // Optional: add styling
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-2 hover:bg-gray-700 ${
            editor.isActive('bold') ? 'bg-gray-700' : ''
          }`}
        >
          <Bold className="h-5 w-5 text-gray-200" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-2 hover:bg-gray-700 ${
            editor.isActive('italic') ? 'bg-gray-700' : ''
          }`}
        >
          <Italic className="h-5 w-5 text-gray-200" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-2 hover:bg-gray-700 ${
            editor.isActive('bulletList') ? 'bg-gray-700' : ''
          }`}
        >
          <List className="h-5 w-5 text-gray-200" />
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter link URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`rounded p-2 hover:bg-gray-700 ${
            editor.isActive('link') ? 'bg-gray-700' : ''
          }`}
        >
          <LinkIcon className="h-5 w-5 text-gray-200" />
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter image URL');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="rounded p-2 hover:bg-gray-700"
        >
          <ImageIcon className="h-5 w-5 text-gray-200" />
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-invert min-h-[200px] max-w-none focus:outline-none"
      />
    </div>
  );
}