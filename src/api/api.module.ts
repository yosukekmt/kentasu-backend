import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthzModule } from './authz/authz.module';
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
    AuthzModule,
  ],
  providers: [ResultResolver, TransactionResolver, UserResolver],
})
export class ApiModule {}
