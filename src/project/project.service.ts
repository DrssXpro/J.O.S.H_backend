import { Injectable, Logger } from "@nestjs/common";
import { Project } from "./entities/project.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectDto, UpdateProjectDto } from "./dto/project.dto";
import { User } from "src/user/entities/user.entity";
import { TemplateDto } from "src/template/dto/template.dto";

@Injectable()
export class ProjectService {
	private logger = new Logger();

	@InjectRepository(Project)
	private projectRepository: Repository<Project>;

	async addProject(userId: number, data: ProjectDto) {
		try {
			const user = new User();
			user.id = userId;
			await this.projectRepository.save({ ...data, cover: "", user });
			return "添加成功";
		} catch (e) {
			this.logger.error(e, ProjectService);
			return "添加失败";
		}
	}

	async updateProject(userId: number, projectId: number, data: UpdateProjectDto) {
		try {
			const user = new User();
			user.id = userId;
			await this.projectRepository.update({ id: projectId }, { ...data, user });
			return "保存项目成功";
		} catch (e) {
			this.logger.error(e, ProjectService);
			return "保存项目失败";
		}
	}

	async deleteProject(projectId: number) {
		await this.projectRepository.delete(projectId);
		return "删除成功";
	}

	async getProjectList(userId: number, pageSize: number, page: number) {
		const skipCount = (page - 1) * pageSize;
		const [projects, totalCount] = await this.projectRepository.findAndCount({
			skip: skipCount,
			take: pageSize,
			where: {
				user: {
					id: userId
				}
			},
			order: {
				createTime: "DESC"
			},
			relations: {
				user: true
			}
		});

		return {
			projects,
			totalCount
		};
	}

	async getProjectListForSelect(userId: number) {
		const projects = await this.projectRepository.find({
			select: ["id", "title"],
			where: {
				user: {
					id: userId
				}
			},
			order: {
				createTime: "DESC"
			},
			relations: {
				user: true
			}
		});
		return projects;
	}

	async getProjectDetail(userId: number, projectId: number) {
		const project = await this.projectRepository.findOne({
			where: {
				id: projectId,
				user: {
					id: userId
				}
			}
		});
		return project;
	}

	async saveTemplateForProject(projectId: number, data: TemplateDto) {
		try {
			await this.projectRepository.update({ id: projectId }, { ...data });
			return "修改应用成功";
		} catch (e) {
			this.logger.error(e, ProjectService);
			return "修改失败";
		}
	}
}
