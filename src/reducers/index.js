const initialState = {
    heroes: [],
    filteredHeroes: [],
    heroesLoadingStatus: 'idle',
    filters: [],
    filtersLoadingStatus: 'idle',
    activeFilter: localStorage.getItem('activeFilter') || 'all'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'HEROES_FETCHING':
            return {
                ...state,
                heroesLoadingStatus: 'loading'
            }   
        case 'HEROES_FETCHED':
            return {
                ...state,
                heroes: action.payload,
                filteredHeroes: state.activeFilter === 'all' ? action.payload : action.payload.filter(item => item.element === state.activeFilter),
                heroesLoadingStatus: 'idle'
            }
        case 'HEROES_FETCHING_ERROR':
            return {
                ...state,
                heroesLoadingStatus: 'error'
            }
        case 'DELETE_HERO':
            const newHeroListAfterDelete = state.heroes.filter(item => item.id !== action.payload)

            return {
                ...state,
                heroes: newHeroListAfterDelete,
                filteredHeroes: state.activeFilter === 'all' ? newHeroListAfterDelete : newHeroListAfterDelete.filter(item => item.element === state.activeFilter)
            }
        case 'ADD_HERO':
            const newHeroListAfterAdd = [...state.heroes, action.payload]
            return {
                ...state,
                heroes: newHeroListAfterAdd,
                filteredHeroes: state.activeFilter === 'all' ? newHeroListAfterAdd : newHeroListAfterAdd.filter(item => item.element === state.activeFilter)
            }
        case 'FILTERS_FETCHING':
            return {
                ...state,
                filtersLoadingStatus: 'loading'
            }
        case 'FILTERS_FETCHED':
            return {
                ...state,
                filters: action.payload,
                filtersLoadingStatus: 'idle'
            }
        case 'FILTERS_FETCHING_ERROR':
            return {
                ...state,
                filtersLoadingStatus: 'error'
            }
        case 'CHANGE_FILTER': {
            localStorage.setItem('activeFilter', action.payload)
            return {
                ...state, 
                filteredHeroes: action.payload === 'all' ? state.heroes : state.heroes.filter(item => item.element === action.payload),
                activeFilter: action.payload
            }
        }
        default: return state
    }
}

export default reducer;