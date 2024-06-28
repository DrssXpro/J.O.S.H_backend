import { Controller, Get } from "@nestjs/common";
import { RequireLogin } from "./custom.decorator";

@Controller()
export class AppController {
	@Get("aaa")
	@RequireLogin()
	aaaa() {
		return "aaa";
	}

	@Get("bbb")
	bbbb() {
		return "bbb";
	}
}
