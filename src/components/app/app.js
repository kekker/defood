import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { RouterStore } from '../../store/routes';

import { ListLayout } from '../client/layouts/list-layout';
import { CheckLayout } from '../client/layouts/check-layout';
import { OrderLayout } from '../client/layouts/order-layoyut';

import { ListLayout as ListAdminLayout } from '../admin/layouts/list-layout';
import { CheckAdminLayout } from '../admin/layouts/check-admin-layout';


class App extends Component {
    constructor(props) {
        super(props);

        const route = (path, layout, exact = true) => ({path, layout, exact});

        this.routes = [
            route(RouterStore.website.index, <ListLayout/>),
            route(RouterStore.website.check, <CheckLayout/>),
            route(RouterStore.website.order, <OrderLayout />),
            route(RouterStore.admin.index, <ListAdminLayout />),
            route(RouterStore.admin.check, <CheckAdmintLayout />),
        ];

    }

    render() {
        const routes = this.routes.map((route, idx) => {
            const { path, layout, exact } = route;
            return <Route key={idx} path={path} exact={exact} render={() => layout} />;
        });

        return(
            <BrowserRouter>
                <div className={'component-app'}>
                    <Switch>
                        { routes }
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
export { App };