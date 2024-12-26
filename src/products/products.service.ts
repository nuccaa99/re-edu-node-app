import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(private UsersService: UsersService) {}
  private products = {
    ka: [
      {
        id: 1,
        name: 'დამტენი',
        price: '50',
        category: 'ტექნიკა',
        cteatedAt: 'today',
      },
      {
        id: 2,
        name: 'ლეპტოპი',
        price: '1500',
        category: 'ტექნიკა',
        cteatedAt: 'yesterday',
      },
    ],
    en: [
      {
        id: 1,
        name: 'charger',
        price: '50',
        category: 'electronics',
        cteatedAt: 'today',
      },
      {
        id: 2,
        name: 'laptop',
        price: '1500',
        category: 'electronics',
        cteatedAt: 'yesterday',
      },
    ],
  };

  getAllProducts(
    productFilters: UpdateProductDto,
    lang: 'ka' | 'en',
    userId: number,
  ) {
    let filteredProducts = this.products[lang];
    if (productFilters.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === productFilters.category,
      );
    }
    if (productFilters.price) {
      filteredProducts = filteredProducts.filter(
        (product) => parseInt(product.price) > parseInt(productFilters.price),
      );
    }
    const user = this.UsersService.getUserById(userId);
    const subscribeDate = new Date(user.subscribeDate);
    const today = new Date();
    const differenceInMs = today.getTime() - subscribeDate.getTime();
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    if (differenceInDays <= 30) {
      filteredProducts = filteredProducts.map((product) => {
        return { ...product, price: (Number(product.price) * 0.95).toString() };
      });
    }
    return filteredProducts;
  }

  getProductById(id: number, lang: 'ka' | 'en') {
    const product = this.products[lang].find((el) => el.id === id);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  createProduct(body: CreateProductDto, lang: 'ka' | 'en') {
    if (!body.category || !body.name || !body.price) {
      throw new HttpException('Fields are required', HttpStatus.BAD_REQUEST);
    }

    const lastId = this.products[lang][this.products[lang].length - 1]?.id || 0;
    const newProduct = {
      id: lastId + 1,
      name: body.name,
      price: body.price,
      category: body.category,
      cteatedAt: new Date().toISOString(),
    };

    this.products.ka.push(newProduct);
    this.products.en.push(newProduct);
    return newProduct;
  }

  deleteProduct(id: number, lang: 'ka' | 'en') {
    const index = this.products[lang].findIndex((el) => el.id === id);
    if (index === -1)
      throw new HttpException('Product id is invalid', HttpStatus.BAD_REQUEST);
    const deletedProductKa = this.products.ka.splice(index, 1);
    const deletedProductEn = this.products.en.splice(index, 1);
    return { ka: deletedProductKa, en: deletedProductEn };
  }

  updateProduct(id: number, body: UpdateProductDto, lang: 'ka' | 'en') {
    const index = this.products[lang].findIndex((el) => el.id === id);
    if (index === -1) {
      throw new HttpException('Product ID is invalid', HttpStatus.BAD_REQUEST);
    }

    const updatedProduct = {
      ...this.products[lang][index],
      ...body,
    };

    this.products.ka[index] = updatedProduct;
    this.products.en[index] = updatedProduct;

    return updatedProduct;
  }
}
