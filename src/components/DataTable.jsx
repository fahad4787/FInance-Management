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
  onApprove,
  getCanApprove,
  searchConfig = {
    enabled: true,
    placeholder: 'Search...',
    searchFields: []
  },
  filters = [],
  additionalFilters = null,
  emptyTitle = 'No Data Yet',
  emptyDescription = 'Get started by adding your first entry',
  titleActions = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const currentData = filteredData;

  const getFilterOptions = (filter) => {
    if (filter.options) return filter.options;
    const uniqueValues = ['All', ...new Set(data.map(item => item[filter.key]).filter(Boolean))].sort();
    return uniqueValues;
  };

  const tableHeader = (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600">
        <FiFileText className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 mt-0.5">Search and filter below</p>
      </div>
    </div>
  );

  const tableCardClass = 'bg-white rounded-2xl shadow-panel overflow-hidden border border-slate-200/80 ring-1 ring-slate-200/50 border-t-4 border-t-primary-500';

  if (isLoading) {
    return (
      <div className={`${tableCardClass} p-8 md:p-12`}>
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/80">{tableHeader}</div>
        <div className="p-8">
          <Loader />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`${tableCardClass} p-8 md:p-12`}>
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/80">{tableHeader}</div>
        <div className="text-center py-16 px-6">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-primary-100 flex items-center justify-center">
            <FiFileText className="w-10 h-10 text-primary-500" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">{emptyTitle}</h4>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={tableCardClass}>
      <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/80 flex flex-row flex-wrap justify-between items-center gap-4">
        {tableHeader}
        {titleActions && <div className="flex-shrink-0">{titleActions}</div>}
      </div>

      <div className="p-4 md:p-5 bg-slate-100/60 border-b border-slate-200/80 flex flex-col md:flex-row gap-4">
        {searchConfig.enabled && (
          <div className="flex-1">
            <label className="text-sm font-semibold mb-2.5 text-slate-700 capitalize tracking-wide block">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={searchConfig.placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="w-5 h-5 text-slate-400" />
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
                onChange={(value) => setFilterValues(prev => ({ ...prev, [filter.key]: value || 'All' }))}
                options={getFilterOptions(filter).filter(opt => opt !== 'All')}
                placeholder={filter.placeholder || `All ${filter.label}s`}
                leftIcon={filter.icon}
              />
            ) : (
              <div>
                <label className="text-sm font-semibold mb-2.5 text-slate-700 capitalize tracking-wide block">
                  {filter.label}
                </label>
                <div className="relative">
                  <select
                    value={filterValues[filter.key] || 'All'}
                    onChange={(e) => setFilterValues(prev => ({ ...prev, [filter.key]: e.target.value }))}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 appearance-none bg-white pr-10 cursor-pointer text-slate-700"
                  >
                    {getFilterOptions(filter).map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {additionalFilters && (
          <div className="flex items-end gap-2 flex-shrink-0">
            {additionalFilters}
          </div>
        )}
      </div>

      {currentData.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <FiSearch className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 font-semibold">No results found</p>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto px-4 py-2">
            <table className="w-full min-w-max">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-200">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap ${column.align || 'text-center'} ${column.className || ''}`}
                    >
                      {column.label}
                    </th>
                  ))}
                  {(onEdit || onDelete || onApprove) && (
                    <th className="text-center py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, localIndex) => {
                    const uniqueId = item.id ?? `row-${localIndex}`;
                    const hasRowAction = onEdit || onDelete || (onApprove && getCanApprove && getCanApprove(item));
                    const isEven = localIndex % 2 === 0;
                    return (
                      <tr key={uniqueId} className={`border-b border-slate-100 ${isEven ? 'bg-white' : 'bg-slate-50/50'} hover:bg-primary-50/60 transition-colors`}>
                        {columns.map((column) => (
                          <td
                            key={column.key}
                            className={`py-3 px-4 text-slate-700 whitespace-nowrap ${column.align || 'text-center'} ${column.className || ''}`}
                          >
                            {column.render ? column.render(item[column.key], item) : (item[column.key] || '-')}
                          </td>
                        ))}
                        {(onEdit || onDelete || onApprove) && (
                          <td className="text-center py-3 px-4">
                            {hasRowAction ? (
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
                                className="p-2 rounded-xl hover:bg-primary-100 text-slate-600 hover:text-primary-700 transition-colors"
                              >
                                <FiMoreVertical className="w-5 h-5 text-slate-600" />
                              </button>
                            </div>
                            ) : null}
                          </td>
                        )}
                      </tr>
                    );
                  })}
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
                className="fixed w-36 bg-white rounded-xl shadow-modal border border-slate-200 z-50 py-1"
                style={{
                  top: `${dropdownPosition.top}px`,
                  right: `${dropdownPosition.right}px`
                }}
              >
                {(() => {
                  const item = currentData.find((_, idx) => {
                    const id = currentData[idx].id ?? `row-${idx}`;
                    return id === openDropdownIndex;
                  });
                  const canApprove = item && onApprove && getCanApprove && getCanApprove(item);
                  return (
                    <>
                      {onEdit && (
                        <button
                          onClick={() => {
                            if (item) onEdit(item, item.id);
                            setOpenDropdownIndex(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-t-xl font-semibold"
                        >
                          Edit
                        </button>
                      )}
                      {canApprove && (
                        <button
                          onClick={() => {
                            if (item) {
                              onApprove(item.id);
                              setOpenDropdownIndex(null);
                            }
                          }}
                          className={`w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 font-semibold ${!onEdit ? 'rounded-t-lg' : ''}`}
                        >
                          Approve
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            if (item) {
                              setDeleteTarget({ id: item.id, item });
                              setOpenDropdownIndex(null);
                            }
                          }}
                          className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold ${!onEdit && !canApprove ? 'rounded-t-xl' : ''} rounded-b-xl`}
                        >
                          Delete
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </>
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
