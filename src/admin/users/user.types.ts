import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/client';

@ObjectType()
export class UserType {
  static fromObj(data: User): UserType {
    return {
      id: data.id,
      email: data.email,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    };
  }

  static fromAry(data: User[]): UserType[] {
    return data.map((d) => UserType.fromObj(d));
  }

  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  deletedAt: Date;
}
