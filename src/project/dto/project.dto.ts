import { IsNotEmpty } from "class-validator";

export class ProjectDto {
	@IsNotEmpty({
		message: "项目名称不能为空"
	})
	title: string;
}

export class UpdateProjectDto extends ProjectDto {
	@IsNotEmpty({
		message: "项目封面不能为空"
	})
	cover: string;
	@IsNotEmpty({
		message: "项目状态不能为空"
	})
	status: boolean;
	@IsNotEmpty({
		message: "项目详情不能为空"
	})
	detail: string;
}
