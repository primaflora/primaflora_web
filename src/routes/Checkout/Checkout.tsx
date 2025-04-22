import { useEffect, useState } from 'react';
import { Service } from '../../common/services';
import { TCartItem } from '../../common/services/cart';
import { Line, SideBar } from '../../components/common';
import { Slider } from '../Home/components/Slider';
import { useUserData } from '../../store/tools';
import { CatalogStripeMob } from '../../components/common/CatalogStripeMob';
import { useTranslation } from 'react-i18next';
import { StorageService } from '../../common/storage/storage.service';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const CheckoutContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
`;

const OrderButton = styled(Button)`
  background: #007bff;
  color: white;

  &:hover {
    background: #0056b3;
  }
`;

const PayButton = styled(Button)`
  background: #28a745;
  color: white;

  &:hover {
    background: #1e7e34;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

export const Checkout = ({ userId }: any) => {
    const { t } = useTranslation();
    const { isAuth } = useUserData();
    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuth]);


    const handleCreateOrder = async () => {
        setLoading(true);
        setError('');
    
        try {
          const response = await fetch(`${process.env.REACT_APP_HOST_URL}/orders/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          });
    
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Ошибка создания заказа');
          console.log(data);
          setOrderId(data.uuid); // Сохраняем ID заказа
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!orderId) return;
    
        setLoading(true);
        setError('');
    
        try {
          const response = await fetch(`${process.env.REACT_APP_HOST_URL}/orders/pay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
          });
    
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Ошибка при создании платежа');
    
          window.open(data.paymentUrl, '_blank'); // Открываем Monobank в новом окне
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

    return (
        <div className="main-global-padding flex">
            <SideBar />
            <div className="cart-main-container">
                <div className="catalog-stripe-mob-container pb-5">
                    <CatalogStripeMob />
                </div>
                <Line />
                <CheckoutContainer>
                    <Title>Оформление заказа</Title>

                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    {!orderId ? (
                        <OrderButton onClick={handleCreateOrder} disabled={loading}>
                        {loading ? 'Создание заказа...' : 'Оформить заказ'}
                        </OrderButton>
                    ) : (
                        <PayButton onClick={handlePayment} disabled={loading}>
                        {loading ? 'Перенаправление на оплату...' : 'Оплатить заказ'}
                        </PayButton>
                    )}
                </CheckoutContainer>
            </div>
        </div>
    );
};
