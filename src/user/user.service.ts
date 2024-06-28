import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { RegisterUserDto } from "./dto/register-user.dto";
import { md5 } from "src/utils";
import { LoginUserDto } from "./dto/login-user.dto";
import { LoginUserVo } from "./vo/login-user.vo";

@Injectable()
export class UserService {
	private logger = new Logger();

	@InjectRepository(User)
	private userRepository: Repository<User>;

	async register(user: RegisterUserDto) {
		const foundUser = await this.userRepository.findOneBy({
			username: user.username
		});

		if (foundUser) {
			throw new HttpException("用户已存在", HttpStatus.BAD_REQUEST);
		}

		const newUser = new User();
		newUser.username = user.username;
		newUser.password = md5(user.password);

		try {
			await this.userRepository.save(newUser);
			return "注册成功";
		} catch (e) {
			this.logger.error(e, UserService);
			return "注册失败";
		}
	}

	async login(loginUserDto: LoginUserDto) {
		const user = await this.userRepository.findOne({
			where: {
				username: loginUserDto.username
			}
		});

		if (!user) {
			throw new HttpException("用户不存在", HttpStatus.BAD_REQUEST);
		}
		if (user.password !== md5(loginUserDto.password)) {
			throw new HttpException("密码错误", HttpStatus.BAD_REQUEST);
		}
		const vo = new LoginUserVo();

		vo.userInfo = {
			id: user.id,
			username: user.username,
			createTime: user.createTime
		};

		return vo;
	}

	async findUserById(userId: number) {
		const user = await this.userRepository.findOne({
			where: {
				id: userId
			}
		});

		return {
			id: user.id,
			username: user.username
		};
	}
}
