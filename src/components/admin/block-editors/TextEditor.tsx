import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { emptyTr } from "@/components/blocks/types";
import type { TextBlockData, TranslatableString } from "@/components/blocks/types";
import { Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon } from "lucide-react";

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const LANGS = ["nl", "en", "es"] as const;
const LANG_LABELS: Record<string, string> = { nl: "🇳🇱 NL", en: "🇬🇧 EN", es: "🇪🇸 ES" };

export function TextEditor({ data, onChange }: Props) {
  const d = data as unknown as TextBlockData;
  const [activeLang, setActiveLang] = useState<"nl" | "en" | "es">("nl");
  const content = (d.content as TranslatableString)?.[activeLang] || "";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Begin met typen..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const newContent = { ...(d.content || emptyTr()), [activeLang]: html };
      onChange({ ...data, content: newContent });
    },
  }, [activeLang]);

  const switchLang = (lang: "nl" | "en" | "es") => {
    setActiveLang(lang);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-foreground">Content</label>
        <div className="flex gap-0.5">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => switchLang(l)}
              className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                activeLang === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {editor && (
        <div className="border border-input rounded-md overflow-hidden">
          <div className="flex items-center gap-0.5 p-1.5 border-b border-input bg-muted/50">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded hover:bg-muted ${editor.isActive("bold") ? "bg-muted text-primary" : "text-muted-foreground"}`}><Bold size={14} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded hover:bg-muted ${editor.isActive("italic") ? "bg-muted text-primary" : "text-muted-foreground"}`}><Italic size={14} /></button>
            <div className="w-px h-4 bg-border mx-1" />
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded hover:bg-muted ${editor.isActive("bulletList") ? "bg-muted text-primary" : "text-muted-foreground"}`}><List size={14} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded hover:bg-muted ${editor.isActive("orderedList") ? "bg-muted text-primary" : "text-muted-foreground"}`}><ListOrdered size={14} /></button>
            <div className="w-px h-4 bg-border mx-1" />
            <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={`p-1.5 rounded hover:bg-muted ${editor.isActive({ textAlign: "left" }) ? "bg-muted text-primary" : "text-muted-foreground"}`}><AlignLeft size={14} /></button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={`p-1.5 rounded hover:bg-muted ${editor.isActive({ textAlign: "center" }) ? "bg-muted text-primary" : "text-muted-foreground"}`}><AlignCenter size={14} /></button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={`p-1.5 rounded hover:bg-muted ${editor.isActive({ textAlign: "right" }) ? "bg-muted text-primary" : "text-muted-foreground"}`}><AlignRight size={14} /></button>
          </div>
          <EditorContent editor={editor} className="prose prose-sm max-w-none p-3 min-h-[120px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px]" />
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Alignment</label>
        <select
          value={d.alignment || "left"}
          onChange={(e) => onChange({ ...data, alignment: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="left">Links</option>
          <option value="center">Midden</option>
          <option value="right">Rechts</option>
        </select>
      </div>
    </div>
  );
}
