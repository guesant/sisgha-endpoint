import { Field } from '@nestjs/graphql';

export type IGenericSearchResult<T> = {
  query: string;

  limit: number;
  offset: number;

  total: number;

  items: T[];
};

export class GenericSearchResultType<T> implements IGenericSearchResult<T> {
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  items!: T[];
}
