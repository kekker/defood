import React, { Component, useEffect } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { useSelector } from 'react-redux';

import './client-check-item.css';
import { state } from '../../../../state';
import { clientActions } from '../../../../state/client/actions';
import { useAction } from '../../../../utils';
import { CheckOrder } from '../check-order';


export const ClientCheckItem = ({ itemData }) => {
    const steps = ['payment', 'baking', 'baked', 'delivering', 'delivered', 'Closed'];
    const ticket = useSelector(state => state.client.ticket);

    const { data, id, status, localDealId } = itemData;

    const stepper = steps.map(item => (
        <Step key={item}>
            <StepLabel>{item}</StepLabel>
        </Step>
    ));

    const waitStatus = useAction(
        data => clientActions.waitStatus(data),
        [],
    );

    useEffect(() => {
        if (status !== 'Closed')
            waitStatus(itemData);
    }, [status]);

    return (
        <div className='client-check-item'>
            <div className='check-title'>Заказ № {localDealId}</div>
            <div className='check-content'>
                {/* <div className='check-content__left-side'>
                    <div className='left-side__item'>
                        <div className='left-side__item-title'>Доставка по адресу</div>
                        <div className='left-side__item-content'>{ address }</div>
                    </div>
                    <div className='left-side__item'>
                        <div className='left-side__item-title'>Получатель</div>
                        <div className='left-side__item-content'>{ info }</div>
                    </div>
                    <div className='left-side__item'>
                        <div className='left-side__item-title'>Время оформления</div>
                        <div className='left-side__item-content'>{ date }</div>
                    </div>
                    <div className='left-side__item'>
                        <div className='left-side__item-title'>Оплата</div>
                        <div className='left-side__item-content'>{ pay }</div>
                    </div>
                </div> */}
                <CheckOrder order={data} />
            </div>
            {steps.indexOf[status] !== -1 && (
                <Stepper className='check-controls' activeStep={steps.indexOf(status)}>
                    { stepper }
                </Stepper>
            )}
        </div>
    );
};