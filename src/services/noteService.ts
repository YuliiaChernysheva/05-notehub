import axios from "axios";
import type { Note, NewNoteData } from "../types/note";

const myToken = import.meta.env.VITE_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${myToken}`,
  },
});

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

type GetNotesParams = {
  search?: string;
  page?: number;
  perPage?: number;
};

export const getNotes = async ({
  search,
  page = 1,
  perPage = 12,
}: GetNotesParams): Promise<NotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search?.trim()) {
    params.search = search.trim();
  }

  const response = await axiosInstance.get<NotesResponse>("/notes", {
    params,
  });

  return response.data;
};

export const addNote = async (noteData: NewNoteData): Promise<Note> => {
  const response = await axiosInstance.post<Note>("/notes", noteData);
  return response.data;
};

export const deleteNote = async (noteId: number): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/notes/${noteId}`);
  return response.data;
};
