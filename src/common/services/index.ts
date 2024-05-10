import { AuthService } from './auth';
import { CategoryService } from './category';
import { ProductService } from './product';
import { LikesService } from './likes';
import { CartService } from './cart';
import { UserService } from './user';

export const Service = {
    CategoryService,
    ProductService,
    LikesService,
    AuthService,
    CartService,
    UserService,
};

export * from './types.ts';
