"use client";

import { Box } from "@mui/material";

type Props = {
  html: string;
};

export function RichTextViewer({ html }: Props) {
  return (
    <Box
      sx={{
        width: "100%",
        color: "inherit",
        lineHeight: 1.7,

        "& p": {
          margin: "0.5rem 0",
        },

        "& h1, & h2, & h3": {
          margin: "1rem 0 0.5rem",
        },

        "& ul, & ol": {
          paddingLeft: "1.5rem",
        },

        "& img": {
          maxWidth: "100%",
          height: "auto",
          display: "block",
          margin: "0.75rem 0",
          borderRadius: "8px",
        },
      }}
      dangerouslySetInnerHTML={{ __html: html || "" }}
    />
  );
}
