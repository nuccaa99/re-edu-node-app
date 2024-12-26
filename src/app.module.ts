import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ProductsModule } from './products/products.module';
import { DesktopAccessMiddleware } from './middlewares/desktop-access.middleware';
import { TimeAccessMiddleware } from './middlewares/time-based.middleware';
import { PermissionMiddleware } from './middlewares/permission.middleware';
import { PostsModule } from './posts/posts.module';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UsersModule,
    ExpensesModule,
    ProductsModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DesktopAccessMiddleware)
      .forRoutes('*')

      .apply(PermissionMiddleware)
      .forRoutes('*')

      .apply(TimeAccessMiddleware)
      .forRoutes('*');
  }
}
