import { Injectable, Logger } from "@nestjs/common";
import { TemplateDto } from "./dto/template.dto";
import { Template } from "./entities/template.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TemplateService {
	private logger = new Logger();

	@InjectRepository(Template)
	private templateRepository: Repository<Template>;
	async addTemplate(userId: number, data: TemplateDto) {
		try {
			const user = new Template();
			user.id = userId;
			await this.templateRepository.save({ ...data, user });
			return "设置模板成功";
		} catch (e) {
			this.logger.error(e, TemplateService);
			return "添加失败";
		}
	}

	async getTemplateListByUser(userId: number, page: number, pageSize: number) {
		const skipCount = (page - 1) * pageSize;
		const [templates, totalCount] = await this.templateRepository.findAndCount({
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
			templates,
			totalCount
		};
	}

	async getTemplateList(page: number, pageSize: number) {
		const skipCount = (page - 1) * pageSize;
		const [templates, totalCount] = await this.templateRepository.findAndCount({
			skip: skipCount,
			take: pageSize,
			order: {
				createTime: "DESC"
			},
			relations: {
				user: true
			}
		});

		return {
			templates,
			totalCount
		};
	}

	async deleteTemplate(userId: number, templateId: number) {
		await this.templateRepository.delete({
			id: templateId,
			user: {
				id: userId
			}
		});
		return "删除成功";
	}
}
