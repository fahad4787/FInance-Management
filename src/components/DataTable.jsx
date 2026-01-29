import { useState } from 'react';
import { FiSearch, FiChevronDown, FiFileText, FiMoreVertical } from 'react-icons/fi';
import SearchableDropdown from './SearchableDropdown';
import Loader from './Loader';
import DeleteConfirmModal from './DeleteConfirmModal';

const DataTable = ({
  data = [],
  columns = [],
  title = 'Table',
  isLoading = false,
  onEdit,
  onDelete,
  searchConfig = {
    enabled: true,
    placeholder: 'Search...',
    searchFields: []
  },
  filters = [],
  pagination = {
    enabled: true,
    itemsPerPage: 5
  }
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = pagination.enabled ? pagination.itemsPerPage : data.length;

  const filteredData = data.filter((item) => {
    if (searchConfig.enabled && searchTerm) {
      const matchesSearch = searchConfig.searchFields.some(field => {
        const value = item[field];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
      if (!matchesSearch) return false;
    }

    return filters.every(filter => {
      const filterValue = filterValues[filter.key] || 'All';
      if (filterValue === 'All' || filterValue === '') return true;
      return item[filter.key] === filterValue;
    });
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getFilterOptions = (filter) => {
    if (filter.options) return filter.options;
    const uniqueValues = ['All', ...new Set(data.map(item => item[filter.key]).filter(Boolean))].sort();
    return uniqueValues;
  };

  if (isLoading) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-lg border-l-4 border-primary-500">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          <div className="w-32 h-0.5 bg-gradient-to-r from-primary-400 to-transparent"></div>
        </div>
        <Loader />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-lg border-l-4 border-primary-500">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          <div className="w-32 h-0.5 bg-gradient-to-r from-primary-400 to-transparent"></div>
        </div>
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <FiFileText className="w-12 h-12 text-gray-400" />
          </div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">No Data Yet</h4>
          <p className="text-gray-500 mb-6">Get started by adding your first entry</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-primary-500">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <div className="w-32 h-0.5 bg-gradient-to-r from-primary-400 to-transparent"></div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {searchConfig.enabled && (
          <div className="flex-1">
            <label className="text-sm font-semibold mb-2.5 text-gray-700 capitalize tracking-wide block">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={searchConfig.placeholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {filters.map((filter) => (
          <div key={filter.key} className="w-full md:w-48">
            {filter.type === 'searchable' ? (
              <SearchableDropdown
                label={filter.label}
                value={filterValues[filter.key] === 'All' ? '' : filterValues[filter.key] || ''}
                onChange={(value) => {
                  setFilterValues(prev => ({ ...prev, [filter.key]: value || 'All' }));
                  setCurrentPage(1);
                }}
                options={getFilterOptions(filter).filter(opt => opt !== 'All')}
                placeholder={filter.placeholder || `All ${filter.label}s`}
                leftIcon={filter.icon}
              />
            ) : (
              <div>
                <label className="text-sm font-semibold mb-2.5 text-gray-700 capitalize tracking-wide block">
                  {filter.label}
                </label>
                <div className="relative">
                  <select
                    value={filterValues[filter.key] || 'All'}
                    onChange={(e) => {
                      setFilterValues(prev => ({ ...prev, [filter.key]: e.target.value }));
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 appearance-none bg-white pr-10 cursor-pointer text-gray-700"
                  >
                    {getFilterOptions(filter).map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {currentData.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FiSearch className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-semibold">No results found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto relative">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`py-3 px-4 text-sm font-semibold text-gray-700 capitalize ${column.align || 'text-center'}`}
                    >
                      {column.label}
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 capitalize">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                      className="py-12 text-center text-gray-500 font-medium"
                    >
                      No matching results. Try adjusting your search or filters.
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, localIndex) => {
                    const filteredIndex = startIndex + localIndex;
                    const uniqueId = item.id || `${localIndex}-${filteredIndex}`;
                    return (
                      <tr key={uniqueId} className="border-b border-gray-100 hover:bg-gray-50">
                        {columns.map((column) => (
                          <td
                            key={column.key}
                            className={`py-3 px-4 text-gray-700 ${column.align || 'text-center'}`}
                          >
                            {column.render ? column.render(item[column.key], item) : (item[column.key] || '-')}
                          </td>
                        ))}
                        {(onEdit || onDelete) && (
                          <td className="text-center py-3 px-4">
                            <div className="relative inline-block">
                              <button
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setDropdownPosition({
                                    top: rect.bottom + 4,
                                    right: window.innerWidth - rect.right
                                  });
                                  setOpenDropdownIndex(openDropdownIndex === uniqueId ? null : uniqueId);
                                }}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <FiMoreVertical className="w-5 h-5 text-gray-600" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {openDropdownIndex && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpenDropdownIndex(null)}
              ></div>
              <div
                className="fixed w-32 bg-white rounded-lg shadow-lg border-2 border-gray-200 z-50"
                style={{
                  top: `${dropdownPosition.top}px`,
                  right: `${dropdownPosition.right}px`
                }}
              >
                {onEdit && (
                  <button
                    onClick={() => {
                      const item = currentData.find((_, idx) => {
                        const uniqueId = currentData[idx].id || `${idx}-${startIndex + idx}`;
                        return uniqueId === openDropdownIndex;
                      });
                      if (item) {
                        onEdit(item, item.id);
                      }
                      setOpenDropdownIndex(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg font-semibold"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      const item = currentData.find((_, idx) => {
                        const uniqueId = currentData[idx].id || `${idx}-${startIndex + idx}`;
                        return uniqueId === openDropdownIndex;
                      });
                      if (item) {
                        setDeleteTarget({ id: item.id, item });
                        setOpenDropdownIndex(null);
                      }
                    }}
                    className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold ${onEdit ? 'rounded-b-lg' : 'rounded-lg'}`}
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          )}

          {pagination.enabled && totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {onDelete && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            if (!deleteTarget) return;
            setIsDeleting(true);
            try {
              await onDelete(deleteTarget.id);
              setDeleteTarget(null);
            } finally {
              setIsDeleting(false);
            }
          }}
          title="Delete Item"
          message="Are you sure you want to delete this item? This action cannot be undone."
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default DataTable;
