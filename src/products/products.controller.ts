import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Query,
  Headers,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CategoryPipes } from './pipes/Category.pipes';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiResponse({ status: 200, description: 'List of all products.' })
  getProducts(
    @Req() request,
    @Query('id', new ParseIntPipe({ optional: true })) id: number,
    @Query(new CategoryPipes()) productFilters,
    @Query('lang', new DefaultValuePipe('en')) lang: 'ka' | 'en',
  ) {
    const userId = request.userId;
    if (id) {
      return this.productsService.getProductById(id, lang);
    }
    return this.productsService.getAllProducts(productFilters, lang, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a product by ID' })
  @ApiResponse({ status: 200, description: 'Product details.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  getProductById(
    @Param('id') id: number,
    @Query('lang', new DefaultValuePipe('en')) lang: 'ka' | 'en',
  ) {
    return this.productsService.getProductById(id, lang);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  createProduct(
    @Body() body,
    @Headers() header,
    @Query('lang', new DefaultValuePipe('en')) lang: 'ka' | 'en',
  ) {
    if (header.password !== '12345') {
      throw new HttpException(
        'Permission not granted',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.productsService.createProduct(body, lang);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'Product successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  deleteProduct(
    @Param('id') id: number,
    @Query('lang', new DefaultValuePipe('en')) lang: 'ka' | 'en',
  ) {
    return this.productsService.deleteProduct(Number(id), lang);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({ status: 200, description: 'Product successfully updated.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  updateProduct(
    @Param('id') id: number,
    @Body() body,
    @Query('lang', new DefaultValuePipe('en')) lang: 'ka' | 'en',
  ) {
    return this.productsService.updateProduct(id, body, lang);
  }
}
