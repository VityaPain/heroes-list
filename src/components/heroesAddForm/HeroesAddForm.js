import { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import {useHttp} from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';

import { addHero } from '../../actions';
import Spinner from '../spinner/Spinner'

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const dispatch = useDispatch()
    const {request} = useHttp();

    const {filters, filtersLoadingStatus} = useSelector(state => state)


    const createHero = ({name, text, element}, resetForm) => {
        const newHero = {
            id: uuidv4(),
            name: name,
            description: text,
            element: element
        }

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(dispatch(addHero(newHero)))
                .then(resetForm())
    }

    const renderFilterOptions = (filters, status) => {
        if (status === 'loading') {
            return <option>Загрузка элемента</option>
        } else if (status === 'error') {
            return <option>Ошибка</option>
        }

        return filters.map(item => {
            if (item.name === 'all') {
                return
            }

            return <option value={item.name}>{item.text}</option>
        })
    }

    const elements = renderFilterOptions(filters, filtersLoadingStatus)

    return (
        <Formik
            initialValues={{
                name: '',
                text: '',
                element: ''
            }}
            validationSchema={Yup.object({
                name: Yup.string()
                        .min(2, 'Минимум 2 символа')
                        .required('Обязательное поле'),
                text: Yup.string()
                        .min(10, 'Минимум 10 символов')
                        .required('Обязательное поле'),
                element: Yup.string().required('Выберите стихию')
            })}
            onSubmit={(values, {resetForm}) => createHero(values, resetForm)}
        >
            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field 
                        type="text" 
                        name="name" 
                        className="form-control" 
                        id="name" 
                        placeholder="Как меня зовут?"
                    />
                    <ErrorMessage className='error' name="name" component="div"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="text" className="form-label fs-4">Описание</label>
                    <Field 
                        name="text" 
                        className="form-control" 
                        id="text" 
                        placeholder="Что я умею?"
                        as="textarea"
                        style={{"height": '130px'}}
                    />
                    <ErrorMessage className='error' name="text" component="div"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                    <Field
                        className="form-select" 
                        id="element" 
                        name="element"
                        as="select"
                    >
                        <option >Я владею элементом...</option>
                        {elements}
                    </Field>
                    <ErrorMessage className='error' name="element" component="div"/>
                </div>

                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>
    )
}

export default HeroesAddForm;