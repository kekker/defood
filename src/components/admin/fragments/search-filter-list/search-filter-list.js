import React, {useReducer} from 'react';

import './search-filter-list.css';

/**
 * Search-input fragment
 * @return {jsx}
 */
function SearchFilterListFragment({}) {
    const data = [{value: '10', text: 'ddd'}, {value: '20', text: 'bbfbfbf'}, {value: '30', text: 'dddddd'}];

    const initialState = {
        selectData: data,
        value: data[0].value,
    };

    const changeField = (field, value) => {
        dispatch({type: 'CHANGE_FIELD', field, value});
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value};
                default:
                    return state;
            }
        },
        initialState
    );

    const {
        selectData,
        value,
    } = state;

    return (
        <div>
            <select className="search-filter-select"
                onChange={(e) => changeField('value', e.target.value)}
                value={value}>
                {selectData.map(item => (
                    <option className="search-filter-select__item" value={item.value}>{item.text}</option>
                ))}
            </select>
        </div>
    );
}

export default SearchFilterListFragment;
