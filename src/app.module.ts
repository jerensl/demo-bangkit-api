import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { DatabaseService } from './database/database.service';
import { NestModule } from '@nestjs/common';
import { AuthzMiddleware } from './authz.middleware';

@Module({
  imports: [UserModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, DatabaseService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthzMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
