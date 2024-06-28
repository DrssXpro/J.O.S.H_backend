import { Body, Controller, Get, Inject, Post, Query, UnauthorizedException } from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Controller("user")
export class UserController {
	@Inject(JwtService)
	private jwtService: JwtService;

	@Inject(ConfigService)
	private configService: ConfigService;

	constructor(private readonly userService: UserService) {}

	@Post("register")
	async register(@Body() registerUser: RegisterUserDto) {
		return await this.userService.register(registerUser);
	}

	@Post("login")
	async userLogin(@Body() loginUser: LoginUserDto) {
		const vo = await this.userService.login(loginUser);
		vo.accessToken = this.jwtService.sign(
			{
				userId: vo.userInfo.id,
				username: vo.userInfo.username
			},
			{
				expiresIn: this.configService.get("jwt_access_token_expires_time") || "30m"
			}
		);

		vo.refreshToken = this.jwtService.sign(
			{
				userId: vo.userInfo.id
			},
			{
				expiresIn: this.configService.get("jwt_refresh_token_expres_time") || "7d"
			}
		);

		return vo;
	}

	@Get("refresh")
	async refresh(@Query("refreshToken") refreshToken: string) {
		try {
			const data = this.jwtService.verify(refreshToken);

			const user = await this.userService.findUserById(data.userId);

			const access_token = this.jwtService.sign(
				{
					userId: user.id,
					username: user.username
				},
				{
					expiresIn: this.configService.get("jwt_access_token_expires_time") || "30m"
				}
			);

			const refresh_token = this.jwtService.sign(
				{
					userId: user.id
				},
				{
					expiresIn: this.configService.get("jwt_refresh_token_expres_time") || "7d"
				}
			);

			return {
				accessToken: access_token,
				refreshToken: refresh_token
			};
		} catch (e) {
			throw new UnauthorizedException("token 已失效，请重新登录");
		}
	}
}
