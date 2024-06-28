import { Project } from "src/project/entities/project.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
	name: "users"
})
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		length: 50,
		comment: "用户名"
	})
	username: string;

	@Column({
		length: 50,
		comment: "密码"
	})
	password: string;

	@CreateDateColumn()
	createTime: Date;

	@UpdateDateColumn()
	updateTime: Date;

	// 一个用户可以有多个项目
	@OneToMany(() => Project, (project) => project.user, {
		cascade: true
	})
	projects: Project[];
}
