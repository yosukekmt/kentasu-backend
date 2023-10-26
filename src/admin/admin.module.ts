import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ResultResolver } from './results/result.resolver';
import { TransactionResolver } from './transactions/transaction.resolver';
import { UserResolver } from './users/user.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/admin/graphql',
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    FirebaseModule,
  ],
  providers: [ResultResolver, TransactionResolver, UserResolver],
})
export class AdminModule {}
