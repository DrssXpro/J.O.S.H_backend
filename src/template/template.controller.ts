import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { TemplateService } from "./template.service";
import { RequireLogin, UserInfo } from "src/custom.decorator";
import { TemplateDto } from "./dto/template.dto";

@Controller("template")
export class TemplateController {
	constructor(private readonly templateService: TemplateService) {}

	// 添加模板
	@RequireLogin()
	@Post()
	async addTemplate(@UserInfo("userId") userId: number, @Body() templateDto: TemplateDto) {
		console.log(templateDto);
		return this.templateService.addTemplate(userId, templateDto);
	}

	// 获取用户自己的模板列表
	@RequireLogin()
	@Get("user_list")
	async getTemplateListByUser(
		@UserInfo("userId") userId: number,
		@Query("pageSize") pageSize: number,
		@Query("page") page: number
	) {
		return this.templateService.getTemplateListByUser(userId, page, pageSize);
	}

	// 获取模板列表
	@RequireLogin()
	@Get("list")
	async getTemplateList(@Query("pageSize") pageSize: number, @Query("page") page: number) {
		return this.templateService.getTemplateList(page, pageSize);
	}

	// 删除模板
	@RequireLogin()
	@Delete(":id")
	async deleteTemplate(@UserInfo("userId") userId: number, @Param("id") templateId: number) {
		return this.templateService.deleteTemplate(userId, templateId);
	}
}
