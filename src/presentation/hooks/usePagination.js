import { useState } from 'react';

export function usePagination(data, initialRowsPerPage = 10) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(Number.parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginated = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, paginated, setPage };
}
