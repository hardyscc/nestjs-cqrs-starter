import { Module } from '@nestjs/common';
import { GraphQLGatewayModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLGatewayModule.forRoot({
      gateway: {
        serviceList: [
          {
            name: 'user',
            url: process.env.USER_ENDPOINT || 'http://localhost:4001/graphql',
          },
          {
            name: 'account',
            url:
              process.env.ACCOUNT_ENDPOINT || 'http://localhost:4002/graphql',
          },
        ],
      },
    }),
  ],
})
export class AppModule {}
