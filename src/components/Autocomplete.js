import fetch from 'isomorphic-fetch';
import React, { useCallback, useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const CACHE = {};
const SEARCH_URI = 'https://api.gbif.org/v1/species/search';
const PER_PAGE = 20;

function makeAndHandleRequest(query, page = 1) {
    return fetch(`${SEARCH_URI}?rank=SPECIES&q=${query}&limit=${PER_PAGE}&offset=${(page - 1) * PER_PAGE}`)
        .then((resp) => resp.json())
        .then(result => ({ options: result.results, total_count: result.count }))
}

function AsyncSpecies() {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [query, setQuery] = useState('');

    const handleInputChange = (q) => {
        setQuery(q);
    };

    const handlePagination = (e, shownResults) => {
        const cachedQuery = CACHE[query];

        // Don't make another request if:
        // - the cached results exceed the shown results
        // - we've already fetched all possible results
        if (
            cachedQuery.options.length > shownResults ||
            cachedQuery.options.length === cachedQuery.total_count
        ) {
            return;
        }

        setIsLoading(true);

        const page = cachedQuery.page + 1;

        makeAndHandleRequest(query, page).then((resp) => {
            const options = cachedQuery.options.concat(resp.options);
            CACHE[query] = { ...cachedQuery, options, page };

            setIsLoading(false);
            setOptions(options);
        });
    };

    // `handleInputChange` updates state and triggers a re-render, so
    // use `useCallback` to prevent the debounced search handler from
    // being cancelled.
    const handleSearch = useCallback((q) => {
        if (CACHE[q]) {
            setOptions(CACHE[q].options);
            return;
        }

        setIsLoading(true);
        makeAndHandleRequest(q).then((resp) => {
            CACHE[q] = { ...resp, page: 1 };

            setIsLoading(false);
            setOptions(resp.options);
        });
    }, []);

    const filterBy = option => option.nameType !== 'VIRUS' && option.vernacularNames.length > 0;
    const dedupeVernaculars = arr => {
       const duped = arr.map(o => o.vernacularName)
        return [...new Set(duped)]
    }

    return (
        <AsyncTypeahead
            id="async-pagination-example"
            filterBy={filterBy}
            isLoading={isLoading}
            labelKey="scientificName"
            maxResults={PER_PAGE - 1}
            minLength={2}
            onInputChange={handleInputChange}
            onPaginate={handlePagination}
            onSearch={handleSearch}
            options={options}
            paginated
            placeholder="Search for a species..."
            renderMenuItemChildren={(option) => (
                <div key={option.key}>
                    <span>{dedupeVernaculars(option.vernacularNames).join(', ')} <strong>{option.scientificName}</strong></span>
                </div>
            )}
            useCache={false}
        />
    );
}

export default AsyncSpecies
