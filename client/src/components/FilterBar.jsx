import React from "react";

const FilterBar = ({
    searchPlaceholder = "Search...",
    onSearch,
    filters = [],
    onFilterChange
}) => {
    return (
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
            {/* Search Input */}
            <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch(e.target.value)}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minWidth: "200px" }}
            />

            {/* Dynamic Filters */}
            {filters.map((filter, index) => (
                <select
                    key={index}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                    <option value="">{filter.label}</option>
                    {filter.options.map((option, idx) => (
                        <option key={idx} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ))}
        </div>
    );
};

export default FilterBar;
