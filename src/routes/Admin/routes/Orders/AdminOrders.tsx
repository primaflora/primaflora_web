import { useEffect, useState } from "react";
import { Panel } from "../../components/Panel"
import { Checkbox } from "../../components/Panel/Panel"
import { TSortType } from "../../components/Panel/types";
import { Row } from "../../../../components/common";

import styled from 'styled-components';
import axios from "axios";
import { apiPrivate } from "../../../../common/api";

const OrdersContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background: #007bff;
  text-align: center;
  color: white;
  padding: 10px;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
`;

const Button = styled.button`
  padding: 5px 10px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #1e7e34;
  }
`;

export const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const response = await apiPrivate.get("https://primaflora-12d77550da26.herokuapp.com/orders");
        setOrders(response.data)
    }
    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        console.log(orders)
    }, [orders])

    return (
        <div>
            <Panel.Title text="Comments" />
            
            <OrdersContainer>
      <Title>Список заказов</Title>

      {orders.length === 0 ? (
        <p>Нет заказов</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Пользователь</Th>
              <Th>Сумма</Th>
              <Th>Статус</Th>
              <Th>Детали</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>{order.user?.id || 'Неизвестно'}</Td>
                <Td>{order.totalPrice} UAH</Td>
                <Td>{order.status}</Td>
                <Td>
                  <Button onClick={() => alert(`Открытие заказа ${order.id}`)}>Открыть</Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </OrdersContainer>


        </div>
    )
}