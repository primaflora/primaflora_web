import React from 'react';
import './styles.css';
import { Section } from './components/Section/Section';
import { Button } from '../../components/buttons';
import { Row } from '../../components/common/Row';
import { useUserData } from '../../store/tools';
import { Service } from '../../common/services';
import { useAuth } from '../../common/hooks/useAuth/useAuth';

export const UserInfo = () => {
    const { user } = useUserData();
    const { setUserData } = useAuth();

    const handleUpdateUser = (updateObj: object) => {
        Service.UserService.patchUpdate(updateObj);
    }

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
                        onUpdate(newValue) {
                            handleUpdateUser({ name: newValue });
                        }
                    }}
                />
                <Section
                    title="(ПІБ другої особи)"
                    content={'(ПІБ другої особи)'}
                    button={{
                        text: 'Редагувати',
                        onUpdate: () => {
                            console.log('Edit Section #1');
                        },
                    }}
                />
                <Section
                    title="(Особистий номер в компанії)"
                    content={user?.login || '#0001'}
                    button={{
                        text: 'Редагувати',
                        onUpdate(newValue) {
                            handleUpdateUser({ login: newValue });
                        }
                    }}
                />
                <Section
                    title="(Реферальне посилання)"
                    content="http://primaflora/link/TESTLINK"
                    button={{
                        text: 'Редагувати',
                        onUpdate: () => {},
                    }}
                />
                <Section
                    title="Телефон"
                    content={user?.phone || '+380000000000'}
                    button={{
                        text: 'Редагувати',
                        onUpdate(newValue) {
                            handleUpdateUser({ phone: newValue });
                        }
                    }}
                />
                <Section
                    title="Пошта"
                    content={user?.email || 'test@primaflora.com'}
                    button={{
                        text: 'Редагувати',
                        onUpdate(newValue) {
                            handleUpdateUser({ email: newValue });
                        }
                    }}
                />
                <Section
                    title="Пароль (хеш)"
                    content={user?.password || '********'}
                    button={{
                        text: 'Редагувати',
                        onUpdate: () => {},
                    }}
                />
            </div>
        </div>
    );
};
