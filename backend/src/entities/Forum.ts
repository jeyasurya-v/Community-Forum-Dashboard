import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class Forum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column("simple-array", { nullable: true })
  tags: string[];

  @ManyToOne(() => User, user => user.forums)
  user: User;

  @OneToMany(() => Comment, comment => comment.forum)
  comments: Comment[];

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    return {
      ...this,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      user: this.user ? {
        id: this.user.id,
        username: this.user.username
      } : null,
      comments: this.comments ? this.comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        user: comment.user ? {
          id: comment.user.id,
          username: comment.user.username
        } : null
      })) : []
    };
  }
}