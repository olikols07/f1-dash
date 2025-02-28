"use client";

import SegmentedControls from "@/components/ui/SegmentedControls";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import Input from "@/components/ui/Input";

import FavoriteDrivers from "@/components/settings/FavoriteDrivers";

import DelayInput from "@/components/DelayInput";
import Toggle from "@/components/ui/Toggle";

import { useSettingsStore } from "@/stores/useSettingsStore";

export default function SettingsPage() {
	const settings = useSettingsStore();
	return (
		<div>
			<h1 className="my-4 text-3xl">Settings</h1>

			<h2 className="my-4 text-2xl">Visual</h2>

			<div className="flex gap-2">
				<Toggle enabled={settings.carMetrics} setEnabled={(v) => settings.setCarMetrics(v)} />
				<p className="text-zinc-500">Show Car Metrics (RPM, Gear, Speed)</p>
			</div>

			<div className="flex gap-2">
				<Toggle enabled={settings.showCornerNumbers} setEnabled={(v) => settings.setShowCornerNumbers(v)} />
				<p className="text-zinc-500">Show Corner Numbers on Track Map</p>
			</div>

			<div className="flex gap-2">
				<Toggle enabled={settings.tableHeaders} setEnabled={(v) => settings.setTableHeaders(v)} />
				<p className="text-zinc-500">Show Driver Table Header</p>
			</div>

			<div className="flex gap-2">
				<Toggle enabled={settings.showBestSectors} setEnabled={(v) => settings.setShowBestSectors(v)} />
				<p className="text-zinc-500">Show Drivers Best Sectors</p>
			</div>

			<div className="flex gap-2">
				<Toggle enabled={settings.showMiniSectors} setEnabled={(v) => settings.setShowMiniSectors(v)} />
				<p className="text-zinc-500">Show Drivers Mini Sectors</p>
			</div>

			<div className="flex gap-2">
				<Toggle enabled={settings.raceControlChime} setEnabled={(v) => settings.setRaceControlChime(v)} />
				<p className="text-zinc-500">Play Race Control Chime</p>
			</div>

			{settings.raceControlChime && (
				<div className="flex max-w-52 flex-col gap-2">
					<p>Race Control Chime Volume</p>
					<div className="flex flex-row items-center gap-2">
						<Slider value={settings.raceControlChimeVolume} setValue={(v) => settings.setRaceControlChimeVolume(v)} />
						<Input
							value={String(settings.raceControlChimeVolume)}
							setValue={(v) => {
								const numericValue = Number(v);
								if (!isNaN(numericValue)) {
									settings.setRaceControlChimeVolume(numericValue);
								}
							}}
						/>
					</div>
				</div>
			)}

			<h2 className="my-4 text-2xl">Favorite Drivers</h2>

			<p className="mb-4">Select your favorite drivers to highlight them on the dashboard.</p>

			<FavoriteDrivers />

			<h2 className="my-4 text-2xl">Speed Metric</h2>

			<p className="mb-4">Choose the unit in which you want to display speeds.</p>

			<SegmentedControls
				id="speed-unit"
				selected={settings.speedUnit}
				onSelect={settings.setSpeedUnit}
				options={[
					{ label: "km/h", value: "metric" },
					{ label: "mp/h", value: "imperial" },
				]}
			/>

			<h2 className="my-4 text-2xl">Delay</h2>

			<p className="mb-4">
				Here you have to option to set a delay for the data, it will displayed the amount entered in seconds later than
				on the live edge. On the Dashboard page there is the same delay input field so you can set it without going to
				the settings. It can be found in the most top bar on the right side.
			</p>

			<div className="flex items-center gap-2">
				<DelayInput />
				<p className="text-zinc-500">Delay in seconds</p>
			</div>

			<Button className="mt-2 bg-red-500!" onClick={() => settings.setDelay(0)}>
				Reset delay
			</Button>
		</div>
	);
}
