import axios from "axios";
import type { NotesResponse } from "../types/note";

const myToken = import.meta.env.VITE_NOTEHUB_TOKEN;

export const fetchNotes = async (page: number): Promise<NotesResponse> => {
  const response = await axios.get<NotesResponse>(
    "https://notehub-public.goit.study/api/notes",
    {
      params: { page },
      headers: {
        Authorization: `Bearer ${myToken}`,
      },
    }
  );
  return response.data;
};
