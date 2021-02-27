import _ from 'lodash';
import { put, takeEvery, takeLatest } from 'redux-saga/effects';

import { dealsActionTypes } from './actions';
import { getDeal, getDeals, createDeal, waitForDealStatus, updateDealStatus } from './core/sagas';
import { config, NODE, NODE_CONFIG } from '../../config';
import { clientActions } from '../client/actions';
import { dealModels } from './order';
import { getOrderTransitions } from './helpers';


export function* callNext({ deal }) {
    const { status: currentStatus } = deal;
    const { statusMap, actionMap } = getOrderTransitions(deal);
    const { next: nextStatus } = statusMap[currentStatus];
    const { transferAction } = actionMap[currentStatus];

    const updatedDeal = transferAction === 'wait'
        ? yield waitForDealStatus({ dealId: deal.dealId, status: nextStatus })
        : yield updateDealStatus({ dealId: deal.dealId, nextStatus });

    return [updatedDeal, actionMap[nextStatus]];
}

function* createOrderDeal({ $payload: { parameters } }) {
    const initiator = NODE_CONFIG.node.toUpperCase();
    const deliverer = config.parties.DELIVERY.node.toUpperCase();
    const transferBaker = config.parties.PIZZA2.node.toUpperCase();
    const { InitialOrderDeal, TransferOrderDeal } = dealModels;

    const [initialOrderParameters, transferOrderParameters] =
        _.partition(parameters.orderData, ['baker', NODE]);

    if (initialOrderParameters.length > 0) {
        const initialDealData = new InitialOrderDeal({
            baker: initiator,
            deliverer,
            parameters: {
                ...parameters,
                addressFrom: NODE_CONFIG.address,
                orderData: initialOrderParameters,
            },
        });

        const initialDeal = yield createDeal({ deal: initialDealData.toJSON() });
        yield put(clientActions.setOrder({
            id: initialDeal.dealId,
            data: initialOrderParameters,
            localDealId: initialDeal.localDealId,
        }));
    }

    if (transferOrderParameters.length > 0) {
        const transferDealData = new TransferOrderDeal({
            initiator,
            baker: transferBaker,
            deliverer,
            parameters: {
                ...parameters,
                baker: config.parties.PIZZA2.name,
                addressFrom: config.parties.PIZZA2.address,
                orderData: transferOrderParameters,
            },
        });

        const transferDeal = yield createDeal({ deal: transferDealData.toJSON() });
        yield put(clientActions.setOrder({
            id: transferDeal.dealId,
            data: transferOrderParameters,
            localDealId: transferDeal.localDealId,
        }));
    }
}


export const sagas = [
    takeEvery(dealsActionTypes.CREATE_ORDER_DEAL, createOrderDeal),
];
