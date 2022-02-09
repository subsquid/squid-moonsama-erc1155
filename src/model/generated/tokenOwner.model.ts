import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Owner} from "./owner.model"
import {Token} from "./token.model"

@Entity_()
export class TokenOwner {
  constructor(props?: Partial<TokenOwner>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Owner, {nullable: false})
  owner!: Owner

  @Index_()
  @ManyToOne_(() => Token, {nullable: false})
  token!: Token

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  balance!: bigint
}
