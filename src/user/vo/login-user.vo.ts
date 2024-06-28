interface UserInfo {
	id: number;

	username: string;

	createTime: Date;
}

export class LoginUserVo {
	userInfo: UserInfo;

	accessToken: string;

	refreshToken: string;
}
