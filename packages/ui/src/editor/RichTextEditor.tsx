"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Box, Divider, IconButton, Paper, Tooltip } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import TitleIcon from "@mui/icons-material/Title";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ImageIcon from "@mui/icons-material/Image";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
  maxHeight?: number;
  placeholder?: string;
  disabled?: boolean;
  onAddImage?: () => Promise<string | null> | string | null;
};

export function RichTextEditor({
  value,
  onChange,
  minHeight = 240,
  maxHeight = 240,
  disabled = false,
  onAddImage,
}: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const addImage = async () => {
    if (!onAddImage) return;
    const src = await onAddImage();
    if (!src) return;

    editor.chain().focus().setImage({ src }).run();
  };

  const buttonSx = (active: boolean) => ({
    color: active ? "primary.main" : "text.primary",
  });

  return (
    <Paper variant="outlined">
      <Box
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        gap={0.5}
        px={1}
        py={1}
      >
        <Tooltip title="굵게">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() => editor.chain().focus().toggleBold().run()}
              sx={buttonSx(editor.isActive("bold"))}
            >
              <FormatBoldIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="기울임">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              sx={buttonSx(editor.isActive("italic"))}
            >
              <FormatItalicIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="취소선">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              sx={buttonSx(editor.isActive("strike"))}
            >
              <StrikethroughSIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />

        <Tooltip title="제목">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              sx={buttonSx(editor.isActive("heading", { level: 2 }))}
            >
              <TitleIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="글머리 목록">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              sx={buttonSx(editor.isActive("bulletList"))}
            >
              <FormatListBulletedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="번호 목록">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              sx={buttonSx(editor.isActive("orderedList"))}
            >
              <FormatListNumberedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />

        <Tooltip title="이미지">
          <span>
            <IconButton
              size="small"
              disabled={disabled || !onAddImage}
              onClick={addImage}
            >
              <ImageIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />

        <Tooltip title="실행 취소">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() => editor.chain().focus().undo().run()}
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="다시 실행">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() => editor.chain().focus().redo().run()}
            >
              <RedoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Divider />
      <Box
        px={2}
        py={1.5}
        sx={{
          "& .ProseMirror": {
            outline: "none",
            minHeight: `${minHeight}px`,
            color: "inherit",
            lineHeight: 1.7,
          },

          "& .ProseMirror p": {
            margin: "0.5rem 0",
          },

          "& .ProseMirror h1, & .ProseMirror h2, & .ProseMirror h3": {
            margin: "1rem 0 0.5rem",
          },

          "& .ProseMirror ul, & .ProseMirror ol": {
            paddingLeft: "1.5rem",
          },

          "& .ProseMirror img": {
            maxWidth: "100%",
            height: "auto",
            display: "block",
            margin: "0.75rem 0",
            borderRadius: "8px",
          },
        }}
      >
        <EditorContent editor={editor} className="repo-rich-text-editor" />
      </Box>
    </Paper>
  );
}
