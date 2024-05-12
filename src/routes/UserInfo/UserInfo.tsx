import React from 'react';
import './styles.css';
import { Section } from './components/Section/Section';
import { Button } from '../../components/buttons';
import { Row } from '../../components/common/Row';
import { useUserData } from '../../store/tools';

export const UserInfo = () => {
    const { user } = useUserData();

    return (
        <div className="main-global-padding pt-6">
            <Row style={{ justifyContent: 'flex-end' }}>
                <Button
                    text="ВАША ЗНИЖКА 10%"
                    style={{ width: '13rem', padding: '7px 10px' }}
                    onClick={() => {}}
                />
            </Row>
            <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-6">
                <Section
                    title="(Особистий номер в компанії)"
                    content={user?.name || 'Test User Lorem Ipsum'}
                    button={{
                        text: 'Редагувати',
                        onClick: () => {
                            console.log('Edit Section #1');
                        },
                    }}
                />
                <Section
                    title="(ПІБ другої особи)"
                    content={'(ПІБ другої особи)'}
                    button={{
                        text: 'Редагувати',
                        onClick: () => {
                            console.log('Edit Section #1');
                        },
                    }}
                />
                <Section
                    title="(Особистий номер в компанії)"
                    content={user?.login || '#0001'}
                    button={{
                        text: 'Редагувати',
                        onClick: () => {},
                    }}
                />
                <Section
                    title="(Реферальне посилання)"
                    content="http://primaflora/link/TESTLINK"
                    button={{
                        text: 'Редагувати',
                        onClick: () => {},
                    }}
                />
                <Section
                    title="Телефон"
                    content={user?.phone || '+380000000000'}
                    button={{
                        text: 'Редагувати',
                        onClick: () => {},
                    }}
                />
                <Section
                    title="Пошта"
                    content={user?.email || 'test@primaflora.com'}
                    button={{
                        text: 'Редагувати',
                        onClick: () => {},
                    }}
                />
                <Section
                    title="Пароль (хеш)"
                    content={user?.password || '********'}
                    button={{
                        text: 'Редагувати',
                        onClick: () => {},
                    }}
                />
            </div>
        </div>
    );
};
