'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlock from '@tiptap/extension-code-block';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Type,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Underline as UnderlineIcon,
  Strikethrough,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  defaultValue = '',
}: RichTextEditorProps) => {
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // bulletList and orderedList included by default, no need to configure here
      }),
      Placeholder.configure({ placeholder: 'Write your content...' }),
      Underline,
      Strike,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CodeBlock,
    ],
    content: value || defaultValue || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();
    if (value && value !== currentContent) {
      editor.commands.setContent(value, false);
    } else if (!value && defaultValue && defaultValue !== currentContent) {
      editor.commands.setContent(defaultValue, false);
    }
  }, [value, defaultValue, editor]);

  if (!mounted || !editor) return null;

  const isActive = (type: string, attrs?: Record<string, any>) =>
    editor.isActive(type, attrs);

  const activeVariant = (type: string, attrs?: Record<string, any>) =>
    isActive(type, attrs) ? 'primary' : 'default';

  const toggle = (command: () => void) => {
    command();
    editor.commands.focus();
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 sm:gap-1 border px-3 py-2 rounded-md bg-muted overflow-x-hidden">
        <Button
          type="button"
          size="sm"
          variant={activeVariant('bold')}
          onClick={() => toggle(() => editor.commands.toggleBold())}
        >
          <Bold size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={activeVariant('italic')}
          onClick={() => toggle(() => editor.commands.toggleItalic())}
        >
          <Italic size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={activeVariant('underline')}
          onClick={() => toggle(() => editor.commands.toggleUnderline())}
        >
          <UnderlineIcon size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={activeVariant('strike')}
          onClick={() => toggle(() => editor.commands.toggleStrike())}
        >
          <Strikethrough size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={activeVariant('bulletList')}
          onClick={() => toggle(() => editor.commands.toggleBulletList())}
        >
          <List size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={activeVariant('orderedList')}
          onClick={() => toggle(() => editor.commands.toggleOrderedList())}
        >
          <ListOrdered size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={activeVariant('heading', { level: 1 })}
          onClick={() => toggle(() => editor.commands.toggleHeading({ level: 1 }))}
        >
          <Heading1 size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={activeVariant('heading', { level: 2 })}
          onClick={() => toggle(() => editor.commands.toggleHeading({ level: 2 }))}
        >
          <Heading2 size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={activeVariant('heading', { level: 3 })}
          onClick={() => toggle(() => editor.commands.toggleHeading({ level: 3 }))}
        >
          <Heading3 size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={activeVariant('codeBlock')}
          onClick={() => toggle(() => editor.commands.toggleCodeBlock())}
        >
          <Code size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={() => toggle(() => editor.commands.setParagraph())}
        >
          <Type size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={activeVariant('textAlign', { textAlign: 'left' })}
          onClick={() => toggle(() => editor.commands.setTextAlign('left'))}
        >
          <AlignLeft size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={activeVariant('textAlign', { textAlign: 'center' })}
          onClick={() => toggle(() => editor.commands.setTextAlign('center'))}
        >
          <AlignCenter size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={activeVariant('textAlign', { textAlign: 'right' })}
          onClick={() => toggle(() => editor.commands.setTextAlign('right'))}
        >
          <AlignRight size={16} />
        </Button>
      </div>

      {/* Editor Content */}
<div
  className={cn(
    'tiptap w-full min-w-sm rounded-md border text-sm bg-input text-foreground shadow-[inset_3px_3px_3px_rgba(0,0,0,0.25),inset_-1px_-1px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_3px_rgba(0,0,0,0.25),inset_-1px_-1px_4px_rgba(255,255,255,0.16)] break-words'
  )}
>
  <EditorContent editor={editor}/>
</div>
    </div>
  );
};
