import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Result, User } from '@prisma/client';
import { UserType } from '../users/user.types';

@ObjectType()
export class ResultType {
  static fromObj(data: Result & { user: User }): ResultType {
    return {
      id: data.id,
      resultType: data.resultType,
      userId: data.userId,
      user: UserType.fromObj(data.user),
    };
  }

  static fromAry(data: (Result & { user: User })[]): ResultType[] {
    return data.map((d) => ResultType.fromObj(d));
  }

  @Field(() => ID)
  id: string;

  @Field()
  resultType: string;

  @Field()
  userId: string;

  @Field(() => UserType)
  user: UserType;
}
