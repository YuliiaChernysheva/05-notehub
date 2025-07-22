// import { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { fetchNotes } from "../../services/noteService";
// import type { Note } from "../../types/note";
// import SearchBox from "../SearchBox/SearchBox";
// import NoteList from "../NoteList/NoteList";
// import Pagination from "../Pagination/Pagination";
// import Loader from "../Loader/Loader";
// import ErrorMessage from "../ErrorMessage/ErrorMessage";
// import Modal from "../Modal/Modal";
// import NoteForm from "../NoteForm/NoteForm";
// import toast, { Toaster } from "react-hot-toast";
// import css from "./App.module.css";

// export default function App() {
//   const [query, setQuery] = useState<string>(""); // Пошуковий запит
//   const [selectedNote, setSelectedNote] = useState<Note | null>(null); // Вибрана нотатка для модалки
//   const [currentPage, setCurrentPage] = useState<number>(1); // Поточна сторінка
//   const [isModalOpen, setIsModalOpen] = useState(false); // Стан для відкриття/закриття модалки

//   // Запит для отримання нотаток
//   const queryResult = useQuery({
//     queryKey: ["notes", query, currentPage],
//     queryFn: () => fetchNotes(query, currentPage),
//     enabled: query !== "", // Запит активний, тільки якщо є пошуковий запит
//     placeholderData: true,
//   });

//   const { isLoading, isError, isSuccess, data } = queryResult;

//   const notes = data ? data.notes : [];
//   const totalPages = data ? data.totalPages : 0;

//   const handleSearch = (newQuery: string) => {
//     if (!newQuery.trim()) return;
//     setSelectedNote(null);
//     setQuery(newQuery);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (nextPage: number) => {
//     setCurrentPage(nextPage);
//   };

//   // Показуємо повідомлення, якщо немає нотаток по запиту
//   useEffect(() => {
//     if (isSuccess && notes.length === 0 && query) {
//       toast("No notes found for your request.");
//     }
//   }, [isSuccess, notes.length, query]);

//   return (
//     <div className={css.app}>
//       <Toaster />
//       <SearchBox onSearch={handleSearch} />
//       {isSuccess && totalPages > 1 && (
//         <Pagination
//           page={currentPage}
//           total={totalPages}
//           onChange={handlePageChange}
//         />
//       )}
//       {isLoading && <Loader />}
//       {isError && <ErrorMessage />}
//       {isSuccess && notes.length > 0 && <NoteList items={notes} />}
//       {isModalOpen && (
//         <Modal onClose={() => setIsModalOpen(false)}>
//           <NoteForm onClose={() => setIsModalOpen(false)} />
//         </Modal>
//       )}
//       {selectedNote && (
//         <Modal onClose={() => setSelectedNote(null)}>
//           <div>{selectedNote.title}</div>
//           <div>{selectedNote.content}</div>
//         </Modal>
//       )}
//       <button
//         className={css.button}
//         type="button"
//         onClick={() => setIsModalOpen(true)}
//       >
//         Create note +
//       </button>
//     </div>
//   );
// }
// src/components/App/App.tsximport { useState } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getNotes } from "../../services/noteService";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleSearch = useDebouncedCallback((search: string) => {
    setDebouncedSearch(search);
  }, 300);

  const handleSearchChange = (search: string) => {
    setSearch(search);
    setPage(1);
    handleSearch(search);
  };

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      getNotes({
        page,
        perPage: 12,
        search: debouncedSearch,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onSearch={handleSearchChange} />

        {data && data.totalPages > 1 && (
          <Pagination page={page} total={data.totalPages} onChange={setPage} />
        )}

        <button
          className={css.button}
          type="button"
          onClick={() => setModalIsOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}

      {!isLoading && isError && <ErrorMessage />}

      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isSuccess && data.notes.length === 0 && <p>No notes found</p>}

      {modalIsOpen && (
        <Modal onClose={() => setModalIsOpen(false)}>
          <NoteForm onClose={() => setModalIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
