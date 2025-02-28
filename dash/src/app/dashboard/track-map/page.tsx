"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import clsx from "clsx";

import Map from "@/components/Map";
import DriverTag from "@/components/driver/DriverTag";
import DriverDRS from "@/components/driver/DriverDRS";
import DriverInfo from "@/components/driver/DriverInfo";
import DriverGap from "@/components/driver/DriverGap";
import DriverLapTime from "@/components/driver/DriverLapTime";

import { objectEntries } from "@/lib/driverHelper";
import { sortPos } from "@/lib/sorting";

import { useCarDataStore, useDataStore } from "@/stores/useDataStore";
import { Driver, TimingDataDriver } from "@/types/state.type";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function TrackMap() {
	const drivers = useDataStore((state) => state?.driverList);
	const driversTiming = useDataStore((state) => state?.timingData);

	return (
		<LayoutGroup key="track-map">
			<div className="flex h-full divide-x divide-zinc-800">
				<div className="flex w-fit flex-col divide-y divide-zinc-800">
					{(!drivers || !driversTiming) &&
						new Array(20).fill("").map((_, index) => <SkeletonDriver key={`driver.loading.${index}`} />)}

					{drivers && driversTiming && (
						<AnimatePresence>
							{objectEntries(driversTiming.lines)
								.sort(sortPos)
								.map((timingDriver, index) => (
									<TrackMapDriver
										key={`trackmap.driver.${timingDriver.racingNumber}`}
										position={index + 1}
										driver={drivers[timingDriver.racingNumber]}
										timingDriver={timingDriver}
									/>
								))}
						</AnimatePresence>
					)}
				</div>

				<div className="flex-1">
					<Map />
				</div>
			</div>
		</LayoutGroup>
	);
}

type TrackMapDriverProps = {
	position: number;
	driver: Driver;
	timingDriver: TimingDataDriver;
};

const hasDRS = (drs: number) => drs > 9;

const possibleDRS = (drs: number) => drs === 8;

const inDangerZone = (position: number, sessionPart: number) => {
	switch (sessionPart) {
		case 1:
			return position > 15;
		case 2:
			return position > 10;
		case 3:
		default:
			return false;
	}
};

const TrackMapDriver = ({ position, driver, timingDriver }: TrackMapDriverProps) => {
	const sessionPart = useDataStore((state) => state?.timingData?.sessionPart);
	const timingStatsDriver = useDataStore((state) => state?.timingStats?.lines[driver.racingNumber]);
	const appTimingDriver = useDataStore((state) => state?.timingAppData?.lines[driver.racingNumber]);
	const hasFastest = timingStatsDriver?.personalBestLapTime.position == 1;

	const carData = useCarDataStore((state) =>
		state?.carsData ? state.carsData[driver.racingNumber].Channels : undefined,
	);

	const favoriteDriver = useSettingsStore((state) => state.favoriteDrivers.includes(driver.racingNumber));

	return (
		<motion.div
			layout="position"
			className={clsx("flex flex-col gap-1 p-1.5 select-none", {
				"opacity-50": timingDriver.knockedOut || timingDriver.retired || timingDriver.stopped,
				"bg-sky-800/30": favoriteDriver,
				"bg-violet-800/30": hasFastest,
				"bg-red-800/30": sessionPart != undefined && inDangerZone(position, sessionPart),
			})}
		>
			<div
				className="grid items-center gap-2"
				style={{
					gridTemplateColumns: "5.5rem 4rem 4rem 5rem 5rem",
				}}
			>
				<DriverTag className="min-w-full!" short={driver.tla} teamColor={driver.teamColour} position={position} />
				<DriverDRS
					on={carData ? hasDRS(carData[45]) : false}
					possible={carData ? possibleDRS(carData[45]) : false}
					inPit={timingDriver.inPit}
					pitOut={timingDriver.pitOut}
				/>
				<DriverInfo timingDriver={timingDriver} gridPos={appTimingDriver ? parseInt(appTimingDriver.gridPos) : 0} />
				<DriverGap timingDriver={timingDriver} sessionPart={sessionPart} />
				<DriverLapTime last={timingDriver.lastLapTime} best={timingDriver.bestLapTime} hasFastest={hasFastest} />
			</div>
		</motion.div>
	);
};

const SkeletonDriver = () => {
	const animateClass = "h-8 animate-pulse rounded-md bg-zinc-800";

	return (
		<div
			className="grid place-items-center items-center gap-1 p-1"
			style={{
				gridTemplateColumns: "5.5rem 4rem 5.5rem 5rem 5rem",
			}}
		>
			<div className={animateClass} style={{ width: "100%" }} />

			<div className={animateClass} style={{ width: "90%" }} />

			{new Array(2).fill(null).map((_, index) => (
				<div className="flex w-full flex-col gap-1" key={`skeleton.${index}`}>
					<div className={clsx(animateClass, "h-4!")} />
					<div className={clsx(animateClass, "h-3! w-2/3")} />
				</div>
			))}

			<div className="flex w-full flex-col gap-1">
				<div className={clsx(animateClass, "h-3! w-4/5")} />
				<div className={clsx(animateClass, "h-4!")} />
			</div>
		</div>
	);
};
