import { put, takeLatest, takeEvery, select } from 'redux-saga/effects';

import { adminActions, adminActionTypes } from './actions';
import { pagedData, orderMock2 } from '../../store/admin-mock-data';
import { orderStatusMap } from './deals';


function* setBusy(value) {
    yield put(adminActions.setStatus({ busy: value }));
}

function* getOrders() {
    // Запрос на получение всех данных для списка
    yield put(adminActions.setOrders(pagedData.data));
}

// actionType one of 'onSuccess', 'onReject'
function* updateNextStatus({ $payload: { actionType } }) {
    const currentOrder = yield select(
        ({ admin }) => admin.currentOrder,
    );

    const currentStatus = currentOrder.status;
    const nextStatus = orderStatusMap[currentStatus].next[actionType];
    // call API updateStatus
    yield put(adminActions.setOrder(
        {
            ...currentOrder,
            status: nextStatus,
            history: [
                ...currentOrder.history,
                {
                    status: currentStatus,
                    version: 2,
                    remark: 'REMARK',
                    executor: 'CLIENT1',
                },
            ],
        },
    ));
}

function* createOrder({ $payload: { params } }) {
    // After calling createOrder API we get a queueId and localDealId

    // const response = { queueId: 'QUEUEID', localDealId: 'LOCALDEALID' };
    const response = { queueId: 'QUEUEID', localDealId: '3321' };
    const { queueId, localDealId } = response;

    yield put(adminActions.setOrder(
        { queueId, localDealId, parameters: { ...params }, status: 'created', history: [] },
    ));

    yield updateNextStatus({ $payload: { actionType: 'onSuccess' } });
}

function* getOrder({ $payload: { id } }) {
    // call API getOrder
    const order = orderMock2;
    yield put(adminActions.setOrder(
        { ...order },
    ));
}

export const sagas = [
    takeLatest(adminActionTypes.GET_ORDERS, getOrders),
    takeEvery(adminActionTypes.GET_ORDER, getOrder),
    takeEvery(adminActionTypes.CREATE_ORDER, createOrder),
    takeEvery(adminActionTypes.UPDATE_NEXT_STATUS, updateNextStatus),
];
