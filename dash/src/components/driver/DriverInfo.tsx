import clsx from "clsx";

import { TimingDataDriver } from "@/types/state.type";

type Props = {
	timingDriver: TimingDataDriver;
	gridPos?: number;
};

export default function DriverInfo({ timingDriver, gridPos }: Props) {
	const positionChange = gridPos && gridPos - parseInt(timingDriver.position);
	const gain = positionChange && positionChange > 0;
	const loss = positionChange && positionChange < 0;

	const status = timingDriver.knockedOut
		? "OUT"
		: !!timingDriver.cutoff
			? "CUTOFF"
			: timingDriver.retired
				? "RETIRED"
				: timingDriver.stopped
					? "STOPPED"
					: timingDriver.inPit
						? "PIT"
						: timingDriver.pitOut
							? "PIT OUT"
							: null;

	return (
		<div className="flex flex-col place-self-start tabular-nums">
			<p
				className={clsx("font-semibold leading-none", {
					"text-emerald-500": gain,
					"text-red-500": loss,
					"text-gray-700": !gain && !loss,
				})}
			>
				{positionChange !== undefined
					? gain
						? `+${positionChange}`
						: loss
							? positionChange
							: "-"
					: `${timingDriver.numberOfLaps}L`}
			</p>

			<p className="text-sm leading-none text-zinc-500">{status ?? "-"}</p>
		</div>
	);
}
