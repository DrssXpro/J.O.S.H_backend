import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { FormatResponseInterceptor } from "./format-response.interceptor";
import { InvokeRecordInterceptor } from "./invoke-record.interceptor";
import { CustomExceptionFilter } from "./custom-exception.filter";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.enableCors();
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new FormatResponseInterceptor());
	app.useGlobalInterceptors(new InvokeRecordInterceptor());
	app.useGlobalFilters(new CustomExceptionFilter());

	app.useStaticAssets(join(__dirname, "images"), {
		prefix: "/images"
	});

	const configService = app.get(ConfigService);

	await app.listen(configService.get("nest_server_port"));
}
bootstrap();
