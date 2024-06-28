import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { RequireLogin, UserInfo } from "src/custom.decorator";
import { ProjectDto, UpdateProjectDto } from "./dto/project.dto";
import { sourceData } from "../projectSourceData";
import { TemplateDto } from "src/template/dto/template.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("project")
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	// 添加项目
	@RequireLogin()
	@Post()
	async addProject(@UserInfo("userId") userId: number, @Body() projectDto: ProjectDto) {
		return this.projectService.addProject(userId, projectDto);
	}

	// 获取项目详情
	@RequireLogin()
	@Get("/detail/:id")
	async getProjectDetail(@UserInfo("userId") userId: number, @Param("id") projectId: number) {
		return this.projectService.getProjectDetail(userId, projectId);
	}

	// 修改项目
	@RequireLogin()
	@Put(":id")
	async updateProject(
		@UserInfo("userId") userId: number,
		@Param("id") projectId: number,
		@Body() updateDto: UpdateProjectDto
	) {
		return this.projectService.updateProject(userId, projectId, updateDto);
	}

	// 删除项目
	@RequireLogin()
	@Delete(":id")
	async deleteProject(@Param("id") projectId: number) {
		return this.projectService.deleteProject(projectId);
	}

	// 获取项目列表
	@RequireLogin()
	@Get("list")
	async getProjectList(
		@UserInfo("userId") userId: number,
		@Query("pageSize") pageSize: number,
		@Query("page") page: number
	) {
		return this.projectService.getProjectList(userId, pageSize, page);
	}

	// 获取物料资源库内容
	@RequireLogin()
	@Get("source_list")
	async getProjectSourceList() {
		return sourceData;
	}

	// 获取项目列表（select 使用）
	@RequireLogin()
	@Get("select_list")
	async getProjectListForSelect(@UserInfo("userId") userId: number) {
		return this.projectService.getProjectListForSelect(userId);
	}

	// 存为模板
	@RequireLogin()
	@Post("save/:id")
	async saveTemplateForProject(@Param("id") projectId: number, @Body() template: TemplateDto) {
		return this.projectService.saveTemplateForProject(projectId, template);
	}

	// 项目文件封面上传
	@Post("upload/:id")
	@UseInterceptors(FileInterceptor("file"))
	async uploadProjectCover(@UploadedFile() file) {
		return file.filename;
	}
}
