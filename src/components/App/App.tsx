// import { useState } from "react";
// import { useQuery, keepPreviousData } from "@tanstack/react-query";

// import Modal from "../Modal/Modal";
// import NoteList from "../NoteList/NoteList";
// import SearchBox from "../SearchBox/SearchBox";
// import Pagination from "../Pagination/Pagination";

// import css from "./App.module.css";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "./services/noteService"; // Імпорт твоєї функції для запиту нотатків
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox"; // Якщо є компонент пошуку
import Pagination from "../Pagination/Pagination"; // Якщо є компонент пагінації
import Modal from "../Modal/Modal"; // Якщо є компонент для модальних вікон
import css from "./App.module.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);

  // Отримуємо дані через useQuery з пагінацією
  const { data, isLoading, isError } = useQuery(
    ["notes", currentPage], // Мітка для запиту з пагінацією
    () => fetchNotes(currentPage) // Використовуємо поточну сторінку
  );

  const totalPages = data?.totalPages ?? 0; // Загальна кількість сторінок

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading notes</div>;
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox />
        <Pagination
          page={currentPage}
          total={totalPages}
          onChange={setCurrentPage} // Оновлюємо поточну сторінку при зміні
        />
        <button className={css.button}>Create note +</button>
      </header>
      <Modal>
        {/* Тут передаватимеш компоненти для створення або редагування нотаток */}
      </Modal>
      {data?.notes.length > 0 ? (
        <NoteList items={data.notes} />
      ) : (
        <div>No notes available</div>
      )}
    </div>
  );
}
