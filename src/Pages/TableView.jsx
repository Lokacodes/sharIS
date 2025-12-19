import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import api from '../api/api';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Box,
  Typography,
  TablePagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

function DataTable({
  endpoint,
  title,
  columns,
  showDetail = false,
  detailPath,
  formatCell,
  searchable = true,
  paginated = true,
  rowsPerPageOptions = [5, 10, 25],
}) {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const { logout, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!endpoint) return;

    const token = localStorage.getItem('token');
    api
      .get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setRows(res.data.data || []))
      .catch(() => setRows([]));
  }, [endpoint, login, logout]);

  const inferredColumns =
    columns ||
    (rows.length > 0
      ? Object.keys(rows[0]).map((key) => ({ key, label: key }))
      : []);

  // 🔍 Filter rows
  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const lower = search.toLowerCase();

    return rows.filter((row) =>
      inferredColumns.some((col) => {
        let val;

        if (typeof col.valueGetter === 'function') {
          val = col.valueGetter(row);
        } else if (col.key.includes('.')) {
          val = col.key.split('.').reduce((obj, key) => obj?.[key], row);
        } else {
          val = row[col.key];
        }

        if (val == null) return false;
        return String(val).toLowerCase().includes(lower);
      })
    );
  }, [search, rows, inferredColumns]);


  // 📄 Apply pagination (client-side)
  const paginatedRows = useMemo(() => {
    if (!paginated) return filteredRows;
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage, paginated]);

  // Pagination handlers
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {searchable && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ alignSelf: 'center' }} fontFamily={'montserrat'}>
            {title}
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 250 }}
          />
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label={`${endpoint} table`}>
          <TableHead>
            <TableRow>
              {inferredColumns.map((col) => (
                <TableCell key={col.key}>{col.label}</TableCell>
              ))}
              {showDetail && <TableCell>Detail</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow key={row.id || row._id}>
                {inferredColumns.map((col) => {
                  let value;

                  if (typeof col.valueGetter === 'function') {
                    value = col.valueGetter(row);
                  } else if (col.key.includes('.')) {
                    value = col.key.split('.').reduce((obj, key) => obj?.[key], row);
                  } else {
                    value = row[col.key];
                  }

                  // Auto-format date-like fields (keys containing "date" or "deadline")
                  if (
                    typeof col.key === 'string' &&
                    /(date|deadline)/i.test(col.key) &&
                    value
                  ) {
                    value = formatDate(value);
                  }

                  const formatted = formatCell ? formatCell(col.key, value) : value;

                  return <TableCell key={col.key}>{formatted}</TableCell>;
                })}

                {showDetail && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        navigate(`${detailPath}/${row.id || row._id}`)
                      }
                    >
                      Detail
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {paginatedRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={inferredColumns.length + (showDetail ? 1 : 0)}
                  align="center"
                >
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* 📄 Pagination Controls */}
        {paginated && (
          <TablePagination
            component="div"
            count={filteredRows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            labelRowsPerPage="Baris per halaman:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} dari ${count}`
            }
          />
        )}
      </TableContainer>
    </Box>
  );
}

DataTable.propTypes = {
  endpoint: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string,
    })
  ),
  showDetail: PropTypes.bool,
  detailPath: PropTypes.string,
  title: PropTypes.string,
  formatCell: PropTypes.func,
  searchable: PropTypes.bool,
  paginated: PropTypes.bool,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
};

export default DataTable;
