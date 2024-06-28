import { IsNotEmpty } from "class-validator";

export class TemplateDto {
	@IsNotEmpty({
		message: "项目名称不能为空"
	})
	title: string;

	detail: string;

	cover: string;
}
