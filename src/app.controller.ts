import { Controller, Get } from "@nestjs/common";

const chartData = {
	dimensions: ["product", "data1", "data2"],
	source: [
		{
			product: "Mon",
			data1: 120,
			data2: 130
		},
		{
			product: "Tue",
			data1: 200,
			data2: 130
		},
		{
			product: "Wed",
			data1: 150,
			data2: 312
		},
		{
			product: "Thu",
			data1: 80,
			data2: 268
		},
		{
			product: "Fri",
			data1: 70,
			data2: 155
		},
		{
			product: "Sat",
			data1: 110,
			data2: 117
		},
		{
			product: "Sun",
			data1: 130,
			data2: 160
		}
	]
};

function getRandomNumber(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Controller()
export class AppController {
	// 模拟图表动态数据
	@Get("data_list")
	getChartDataList() {
		chartData.source = chartData.source.map((item) => {
			const data1 = getRandomNumber(50, 200);
			const data2 = getRandomNumber(50, 200);
			return {
				...item,
				data1,
				data2
			};
		});
		return chartData;
	}
}
