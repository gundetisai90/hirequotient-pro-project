import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch data from the API
    fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
      .then(response => response.json())
      .then(data => {
        setData(data);
        setFilteredData(data);
      });
  }, []);

  const updateTable = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    return (
      <>
        <thead>
          <tr>
            <th><input type="checkbox" id="selectAll" onChange={toggleSelectAll} /></th>
            {Object.keys(pageData[0] || {}).map(column => <th key={column}>{column}</th>)}
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((rowData, index) => (
            <tr key={index}>
              <td><input type="checkbox" onChange={() => toggleSelectRow(index)} checked={selectedRows.includes(index)} /></td>
              {Object.values(rowData).map((value, columnIndex) => <td key={columnIndex}>{value}</td>)}
              <td><button className="btn btn-primary" onClick={() => editRow(index)}>Edit</button></td>
              <td><button className="btn btn-danger" onClick={() => deleteRow(index)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </>
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === itemsPerPage) {
      setSelectedRows([]);
    } else {
      setSelectedRows(Array.from({ length: itemsPerPage }, (_, i) => i));
    }
  };

  const toggleSelectRow = (index) => {
    setSelectedRows(prevSelectedRows => {
      if (prevSelectedRows.includes(index)) {
        return prevSelectedRows.filter(selectedIndex => selectedIndex !== index);
      } else {
        return [...prevSelectedRows, index];
      }
    });
  };

  const editRow = (index) => {
    // Replace this with your custom logic for editing rows
    const newData = [...data];
    const rowIndex = (currentPage - 1) * itemsPerPage + index;
    const updatedValue = prompt(`Enter new value for ${Object.keys(newData[rowIndex])[0]}`, Object.values(newData[rowIndex])[0]);
    newData[rowIndex][Object.keys(newData[rowIndex])[0]] = updatedValue;
    setData(newData);
    setFilteredData(newData);
  };

  const deleteRow = (index) => {
    // Replace this with your custom logic for deleting rows
    const newData = [...data];
    const rowIndex = (currentPage - 1) * itemsPerPage + index;
    newData.splice(rowIndex, 1);
    setData(newData);
    setFilteredData(newData);
  };

  const deleteSelected = () => {
    // Replace this with your custom logic for deleting selected rows
    const newData = [...data];
    const updatedData = newData.filter((_, index) => !selectedRows.includes(index));
    setData(updatedData);
    setFilteredData(updatedData);
    setSelectedRows([]);
  };

  const handleSearch = () => {
    const searchTerm = searchInput.toLowerCase();
    const newData = data.filter(row =>
      Object.values(row).some(value => value.toLowerCase().includes(searchTerm))
    );
    setFilteredData(newData);
    setCurrentPage(1);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>
      </div>

      <table className="table">
        {updateTable()}
      </table>

      <div className="d-flex justify-content-between">
        <div>
          <button className="btn btn-danger" onClick={deleteSelected}>Delete Selected</button>
        </div>
        <div className="pagination">
          <button className="btn btn-outline-secondary" onClick={() => setCurrentPage(1)}>First</button>
          <button className="btn btn-outline-secondary" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          <span className="mx-2">{currentPage}</span>
          <button className="btn btn-outline-secondary" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}>Next</button>
          <button className="btn btn-outline-secondary" onClick={() => setCurrentPage(Math.ceil(filteredData.length / itemsPerPage))}>Last</button>
        </div>
      </div>
    </div>
  );
}

export default App;
