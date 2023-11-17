import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { filtersFetching, filtersFetched, filtersFetchingError, activeFilterChanged } from '../../actions';
import Spinner from '../spinner/Spinner';
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {   
    const dispatch = useDispatch()

    const {request} = useHttp()

    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state)

    useEffect(() => {
        dispatch(filtersFetching());
        // request("http://localhost:3001/filters")
        request("https://cdn.jsdelivr.net/gh/VityaPain/heroes-list@main/filters.json")
        // request("https://cors-anywhere.herokuapp.com/https://cdn.jsdelivr.net/gh/VityaPain/heroes-list@main/heroes.json")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))
    }, [])

    const renderFilters = (filters, status) => {
        if (status === 'loading') {
            return <Spinner />
        } else if (status === 'error') {
            return <h5 className="text-center mt-5">Ошибка загрузки</h5>
        }

        return filters.map(({name, className, text}) => {
            const btnClass = classNames('btn', className, {
                'active': name === activeFilter
            });

            return <button
                        key={name}
                        id={name}
                        className={btnClass}
                        onClick={() => dispatch(activeFilterChanged(name))}
                        >{text}</button>
        })
    }

    const elements = renderFilters(filters, filtersLoadingStatus);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;