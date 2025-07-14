const TablePagination = ({ currentPage, totalPages, onPageChange }) => {
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
  
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className="pagination" style={{ display: 'flex', justifyContent: 'center', padding: '16px 0', gap: '8px' }}>
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            background: currentPage === 1 ? '#f5f5f5' : '#fff',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          First
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            background: currentPage === 1 ? '#f5f5f5' : '#fff',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Previous
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              background: currentPage === page ? '#007bff' : '#fff',
              color: currentPage === page ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            background: currentPage === totalPages ? '#f5f5f5' : '#fff',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            background: currentPage === totalPages ? '#f5f5f5' : '#fff',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          Last
        </button>
      </div>
    );
  };

  export default TablePagination