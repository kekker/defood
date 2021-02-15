import { React, useEffect } from 'react';

import { ListPartFragment } from '../../fragments/list-part';
import { SearchInputFragment } from '../../fragments/search-input';
import { AdminPageFragment } from '../../fragments/admin-page';
import { useSelector } from 'react-redux';

import './list-layout.css';
import { adminActions } from '../../../../state/admin/actions';
import { useAction } from '../../../../utils';


/**
 * List layout
 */
export const ListLayout = () => {
    const data = useSelector(state => state.admin.orders);

    const getOrders = useAction(
        () => adminActions.getOrders(),
        [],
    );

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <AdminPageFragment>
            <div className='list-layout-content__title list-layout-content_margin-bottom'>
                Реестр заказов
            </div>
            <SearchInputFragment />
            {data.map((item, index) => (
                <ListPartFragment data={item} key={index} />
            ))}
        </AdminPageFragment>
    );
};
