import clsx from "clsx";

import { getTimeColor } from "@/lib/getTimeColor";
import { TimingDataDriver, TimingStatsDriver } from "@/types/state.type";

type Props = {
	tla: string;
	sectors: TimingDataDriver["sectors"];
};

export default function DriverMiniSectors({ sectors = [], tla }: Props) {
	return (
		<div className="flex gap-2" id="walkthrough-driver-sectors">
			{sectors.map((sector, i) => (
				<div key={`sector.${tla}.${i}`} className="flex flex-col gap-[0.2rem]">
					<div className="flex h-[10px] flex-row gap-1">
						{sector.segments.map((segment, j) => (
							<MiniSector status={segment.status} key={`sector.mini.${tla}.${j}`} />
						))}
					</div>

					<div>
						<p
							className={clsx(
								"text-lg font-semibold leading-none",
								getTimeColor(sector.overallFastest, sector.personalFastest),
								!sector.value ? "text-zinc-600" : "",
							)}
						>
							{!!sector.value ? sector.value : !!sector.previousValue ? sector.previousValue : "-- ---"}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}

function MiniSector({ status }: { status: number }) {
	return (
		<div
			className={clsx("h-[10px] w-2 rounded-[0.2rem]", {
				"bg-yellow-500": status === 2048 || status === 2052, // TODO unsure
				"bg-emerald-500": status === 2049,
				"bg-violet-600": status === 2051,
				"bg-blue-500": status === 2064,
				"bg-zinc-700": status === 0,
			})}
		/>
	);
}
