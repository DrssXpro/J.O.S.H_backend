import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { ProjectModule } from "./project/project.module";
import { TemplateModule } from "./template/template.module";
import { User } from "./user/entities/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { LoginGuard } from "./login.guard";
import { Project } from "./project/entities/project.entity";
import { Template } from "./template/entities/template.entity";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory(configService: ConfigService) {
				return {
					type: "mysql",
					host: configService.get("mysql_server_host"),
					port: configService.get("mysql_server_port"),
					username: configService.get("mysql_server_username"),
					password: configService.get("mysql_server_password"),
					database: configService.get("mysql_server_database"),
					synchronize: true,
					logging: true,
					entities: [User, Project, Template],
					poolSize: 10,
					connectorPackage: "mysql2",
					extra: {
						authPlugin: "sha256_password"
					}
				};
			},
			inject: [ConfigService]
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: "src/.env"
		}),
		JwtModule.registerAsync({
			global: true,
			useFactory(configService: ConfigService) {
				return {
					secret: configService.get("jwt_secret"),
					signOptions: {
						expiresIn: "30m" // 默认 30 分钟
					}
				};
			},
			inject: [ConfigService]
		}),
		UserModule,
		ProjectModule,
		TemplateModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: LoginGuard
		}
	]
})
export class AppModule {}
