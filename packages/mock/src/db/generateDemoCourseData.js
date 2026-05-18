import { writeFileSync } from "node:fs";

const categories = ["development", "design", "marketing", "business"];
const instructors = [
	"김철수",
	"이영희",
	"박지성",
	"최민수",
	"정아름",
	"Alex",
	"Sarah",
	"Michael",
	"Jane",
	"David",
];

// 1000개의 고유 조합을 만들기 위해 키워드 풀 확장
const topicPrefix = {
	development: [
		"React",
		"JavaScript",
		"TypeScript",
		"Next.js",
		"WebGPU",
		"Node.js",
		"Python",
		"Java",
		"Spring Boot",
		"DevOps",
		"Docker",
		"Kubernetes",
		"GraphQL",
		"NestJS",
		"Vue.js",
		"C++",
		"Rust",
		"Go",
	],
	design: [
		"UI/UX",
		"Figma",
		"Design Systems",
		"3D Modeling",
		"Typography",
		"Prototyping",
		"Blender",
		"UX Research",
		"Adobe XD",
		"Interaction Design",
		"Motion Graphics",
		"Character Design",
		"Branding",
		"Illustration",
	],
	marketing: [
		"SEO",
		"Content Strategy",
		"Social Media",
		"Growth Hacking",
		"CRM",
		"Google Analytics",
		"Performance Marketing",
		"Email Marketing",
		"Brand Strategy",
		"Copywriting",
		"B2B Marketing",
		"Market Research",
		"Influencer Marketing",
	],
	business: [
		"Leadership",
		"Agile",
		"Product Management",
		"Startup",
		"Negotiation",
		"Business Communication",
		"Data Analysis",
		"Financial Modeling",
		"Strategic Planning",
		"Project Management",
		"OKRs",
		"Risk Management",
		"HR Strategy",
	],
};
const levels = [
	"입문",
	"초급",
	"중급",
	"고급",
	"심화",
	"실전 집중",
	"마스터",
	"단기 완성",
	"핵심 요약",
	"취업 대비",
];
const formats = [
	"클래스",
	"부트캠프",
	"정규 과정",
	"워크샵",
	"트레이닝",
	"세미나",
	"캠프",
	"프로젝트",
	"멘토링",
	"마스터클래스",
];

const getRandomInt = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateCourses = (count) => {
	const courses = [];
	const now = new Date();
	const usedTitles = new Set(); // 중복 검증을 위한 Set

	for (let i = 1; i <= count; i++) {
		let category, prefix, level, format, title, description;

		// 고유한 제목이 생성될 때까지 반복
		do {
			category = getRandomItem(categories);
			prefix = getRandomItem(topicPrefix[category]);
			level = getRandomItem(levels);
			format = getRandomItem(formats);

			title = `[${category.toUpperCase()}] ${prefix} ${level} ${format}`;
		} while (usedTitles.has(title));

		// 생성된 제목을 Set에 추가하여 다음 반복 시 중복 검사
		usedTitles.add(title);

		description = `본 강의는 ${prefix} 분야의 ${level} 수준 수강생을 위해 설계된 전문 ${format}입니다.`;

		const maxCapacity = getRandomInt(10, 100);

		// 약 20% 확률로 정원이 가득 찬 상태(마감) 생성
		const isFull = Math.random() < 0.2;
		const currentEnrollment = isFull
			? maxCapacity
			: getRandomInt(0, maxCapacity - 1);

		const price = getRandomInt(3, 15) * 10000;

		// 시작일: 현재 기준 -1달 ~ +3달
		const startOffset = getRandomInt(-30, 90);
		const startDate = new Date(now);
		startDate.setDate(now.getDate() + startOffset);

		// 종료일: 시작일 기준 2주 ~ 12주 후
		const durationDays = getRandomInt(14, 84);
		const endDate = new Date(startDate);
		endDate.setDate(startDate.getDate() + durationDays);

		courses.push({
			id: `course-${i.toString().padStart(4, "0")}`,
			title,
			description,
			category,
			price,
			maxCapacity,
			currentEnrollment,
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
			instructor: getRandomItem(instructors),
		});
	}
	return courses;
};

const data = {
	courses: generateCourses(1000),
	categories,
};

writeFileSync(
	new URL("./models/demo-courses.json", import.meta.url),
	JSON.stringify(data, null, 2),
);
console.log(
	"packages/mock/src/db/models/demo-courses.json 파일이 성공적으로 생성되었습니다. (총 1000개 고유 강의)",
);
