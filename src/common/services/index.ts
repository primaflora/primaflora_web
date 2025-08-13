import { AuthService } from './auth';
import { CategoryService } from './category';
import { ProductService } from './product';
import { LikesService } from './likes';
import { CartService } from './cart';
import { UserService } from './user';
import { MonobankService } from './mono';
import { UploadService } from './upload/uploadService';

export const Service = {
    CategoryService,
    ProductService,
    LikesService,
    AuthService,
    CartService,
    UserService,
    MonobankService,
    UploadService,
};

export * from './types.ts';
