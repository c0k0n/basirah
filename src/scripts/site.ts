function closeNav() {
	document.body.classList.remove("nav-open");
	document
		.querySelectorAll("[data-menu-toggle]")
		.forEach((button) => button.setAttribute("aria-expanded", "false"));
}

function toggleNav() {
	const open =
		document
			.querySelector<HTMLElement>("[data-menu-toggle]")
			?.getAttribute("aria-expanded") === "true";
	document.body.classList.toggle("nav-open", !open);
	document
		.querySelectorAll("[data-menu-toggle]")
		.forEach((button) => button.setAttribute("aria-expanded", String(!open)));
}

function initAudioPlayer(player: HTMLElement) {
	const audio = player.querySelector<HTMLAudioElement>("audio");
	const playButton =
		player.querySelector<HTMLButtonElement>("[data-audio-play]");
	const current = player.querySelector<HTMLElement>("[data-audio-current]");
	const duration = player.querySelector<HTMLElement>("[data-audio-duration]");
	const seek = player.querySelector<HTMLInputElement>("[data-audio-seek]");
	if (!audio || !playButton || !current || !duration || !seek) return;

	const icon = playButton.querySelector<HTMLElement>(
		".material-symbols-outlined",
	);
	const formatTime = (seconds: number) => {
		if (!Number.isFinite(seconds)) return "–:––";
		return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
	};
	const updateState = () => {
		const playing = !audio.paused;
		playButton.setAttribute("aria-pressed", String(playing));
		if (icon) icon.textContent = playing ? "pause" : "play_arrow";
	};
	let seeking = false;

	playButton.addEventListener("click", () => {
		if (audio.paused) void audio.play().catch(() => {});
		else audio.pause();
	});
	audio.addEventListener("play", updateState);
	audio.addEventListener("pause", updateState);
	audio.addEventListener("ended", updateState);
	audio.addEventListener("loadedmetadata", () => {
		duration.textContent = formatTime(audio.duration);
	});
	audio.addEventListener("timeupdate", () => {
		current.textContent = formatTime(audio.currentTime);
		if (!seeking && audio.duration)
			seek.value = String((audio.currentTime / audio.duration) * 1000);
	});
	seek.addEventListener("input", () => {
		seeking = true;
		current.textContent = formatTime(
			(Number(seek.value) / 1000) * (audio.duration || 0),
		);
	});
	seek.addEventListener("change", () => {
		if (audio.duration)
			audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
		seeking = false;
	});
}

function initAllAudioPlayers() {
	document
		.querySelectorAll<HTMLElement>("[data-audio-player]")
		.forEach((player) => {
			if (player.dataset.inited) return;
			player.dataset.inited = "1";
			initAudioPlayer(player);
		});
}

function initNav() {
	const toggle = document.querySelector<HTMLElement>("[data-menu-toggle]");
	const nav = document.querySelector<HTMLElement>("[data-nav]");
	if (toggle && nav) {
		toggle.addEventListener("click", toggleNav);
		nav
			.querySelectorAll("a")
			.forEach((link) => link.addEventListener("click", closeNav));
	}
}

function foldText(text: string) {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, "")
		.replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
		.replace(/\u0649/g, "\u064a")
		.replace(/\u0629/g, "\u0647")
		.replace(/\u0640/g, "")
		.replace(/\s+/g, " ");
}

document.addEventListener("input", (event) => {
	const input = event.target;
	if (
		!(input instanceof HTMLInputElement) ||
		!input.hasAttribute("data-list-filter")
	)
		return;
	const scope = input.closest("[data-filter-scope]");
	const list = scope?.querySelector("[data-filter-list]");
	if (!scope || !list) return;

	const term = foldText(input.value);
	const items = [...list.querySelectorAll<HTMLElement>("[data-filter-item]")];
	let visible = 0;
	for (const item of items) {
		const match =
			!term ||
			(item.textContent ? foldText(item.textContent).includes(term) : false);
		item.hidden = !match;
		if (match) visible++;
	}
	scope
		.querySelector<HTMLElement>("[data-filter-empty]")
		?.toggleAttribute("hidden", visible !== 0);
	const live = scope.querySelector<HTMLElement>("[data-filter-live]");
	if (live)
		live.textContent = visible === 0 ? "ရလဒ် မတွေ့ပါ" : `ရလဒ် ${visible} ခု`;
});

initAllAudioPlayers();
initNav();

document.addEventListener("keydown", (event: KeyboardEvent) => {
	if (event.key !== "Escape") return;
	if (!document.body.classList.contains("nav-open")) return;
	closeNav();
	document.querySelector<HTMLElement>("[data-menu-toggle]")?.focus();
});
