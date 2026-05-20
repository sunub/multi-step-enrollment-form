import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	vars,
} from "@shared/design-system";
import { IoIosWarning } from "react-icons/io";

interface WarningAlertDialogProps {
	isDialogOpen: boolean;
	setIsDialogOpen: (open: boolean) => void;
	handleConfirmReset: () => void;
}

export function WarningAlertDialog({
	isDialogOpen,
	setIsDialogOpen,
	handleConfirmReset,
}: WarningAlertDialogProps) {
	return (
		<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div
						style={{
							width: "64px",
							height: "64px",
							borderRadius: "9999px",
							backgroundColor: vars.color.surfaceContainerHigh,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: "24px",
							border: "1px solid rgba(255, 255, 255, 0.5)",
						}}
					>
						<IoIosWarning color={vars.color.primary} size={32} />
					</div>
					<AlertDialogTitle>신청 정보 초기화 안내</AlertDialogTitle>
					<AlertDialogDescription>
						선택하신 신청 유형으로 변경하여 진행할 경우,
						<br />
						이전에 작성하셨던 기존 신청 정보가 모두 초기화됩니다.
						<br />
						이대로 진행하시겠습니까?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>취소</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirmReset}>
						확인
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
