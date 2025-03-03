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

export const CheckoutSuccess = () => {
    return (
        <div className="main-global-padding flex">
            <SideBar />
            <div className="cart-main-container">
                <div className="catalog-stripe-mob-container pb-5">
                    <CatalogStripeMob />
                </div>
                <Line />
                <CheckoutContainer>
                    <Title>Successful payment</Title>
                </CheckoutContainer>
            </div>
        </div>
    );
};
