import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { ResultResolver } from './results/result.resolver';
import { TransactionResolver } from './transactions/transaction.resolver';
import { UserResolver } from './users/user.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/api/graphql',
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
  ],
  providers: [ResultResolver, TransactionResolver, UserResolver],
})
export class ApiModule {}
