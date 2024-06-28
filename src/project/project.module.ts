import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./entities/project.entity";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";

@Module({
	imports: [
		TypeOrmModule.forFeature([Project]),
		MulterModule.register({
			storage: diskStorage({
				destination: join(__dirname, "../images"),
				filename: (_, file, callback) => {
					const fileName = `${new Date().getTime() + extname(file.originalname)}`;
					return callback(null, fileName);
				}
			})
		})
	],
	controllers: [ProjectController],
	providers: [ProjectService]
})
export class ProjectModule {}
