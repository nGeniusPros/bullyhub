"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  className,
}: RichTextEditorProps) {
  const [text, setText] = useState(value);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onChange(newText);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelectionStart(target.selectionStart);
    setSelectionEnd(target.selectionEnd);
  };

  const applyFormatting = (prefix: string, suffix: string = prefix) => {
    if (!textareaRef) return;

    const start = selectionStart;
    const end = selectionEnd;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    const newText = beforeText + prefix + selectedText + suffix + afterText;
    setText(newText);
    onChange(newText);

    // Set focus back to textarea and restore selection with formatting
    setTimeout(() => {
      if (textareaRef) {
        textareaRef.focus();
        textareaRef.setSelectionRange(
          start + prefix.length,
          end + prefix.length
        );
      }
    }, 0);
  };

  const formatBold = () => applyFormatting("**");
  const formatItalic = () => applyFormatting("*");
  const formatUnderline = () => applyFormatting("__");
  const formatH1 = () => applyFormatting("# ", "\n");
  const formatH2 = () => applyFormatting("## ", "\n");
  const formatH3 = () => applyFormatting("### ", "\n");
  const formatBulletList = () => applyFormatting("- ", "\n");
  const formatNumberedList = () => applyFormatting("1. ", "\n");
  const formatLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      applyFormatting("[", "](" + url + ")");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-1 border rounded-md bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatBold}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatItalic}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatUnderline}
          className="h-8 w-8 p-0"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatH1}
          className="h-8 w-8 p-0"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatH2}
          className="h-8 w-8 p-0"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatH3}
          className="h-8 w-8 p-0"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatBulletList}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatNumberedList}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatLink}
          className="h-8 w-8 p-0"
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        ref={(ref) => setTextareaRef(ref)}
        value={text}
        onChange={handleTextChange}
        onSelect={handleSelect}
        placeholder={placeholder}
        className={`min-h-[300px] font-mono ${className}`}
      />
      <div className="text-xs text-muted-foreground">
        <p>Supports Markdown formatting. Use the toolbar or type directly using Markdown syntax.</p>
      </div>
    </div>
  );
}
