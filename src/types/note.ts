export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag;
}
export interface NewNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface NoteUpdateData {
  id: string;
  title?: string;
  content?: string;
  tag?: NoteTag;
}
