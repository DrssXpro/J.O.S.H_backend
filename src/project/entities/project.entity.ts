import { User } from "src/user/entities/user.entity";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";

@Entity({
	name: "projects"
})
export class Project {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		length: 30,
		comment: "名称"
	})
	title: string;

	@Column({
		length: 200,
		comment: "封面"
	})
	cover: string;

	@Column({
		type: "longtext",
		comment: "项目结构"
	})
	detail: string;

	@Column({
		comment: "是否发布",
		default: false
	})
	status: boolean;

	@CreateDateColumn()
	createTime: Date;

	@UpdateDateColumn()
	updateTime: Date;

	@ManyToOne(() => User, (user) => user.projects)
	@JoinColumn({ name: "userId" })
	user: User;
}
