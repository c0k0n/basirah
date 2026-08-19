if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js").catch(() => {});
	});
}

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

let swapped = false;
document.addEventListener("astro:before-swap", () => {
	swapped = true;
});

document.addEventListener("astro:page-load", () => {
	const toggle = document.querySelector<HTMLElement>("[data-menu-toggle]");
	const nav = document.querySelector<HTMLElement>("[data-nav]");
	if (toggle && nav) {
		toggle.addEventListener("click", toggleNav);
		nav
			.querySelectorAll("a")
			.forEach((link) => link.addEventListener("click", closeNav));
	}
	if (swapped) {
		swapped = false;
		const active = document.activeElement;
		const main = document.getElementById("main");
		if (main && (active === document.body || !document.contains(active))) {
			main.focus({ preventScroll: true });
		}
	}
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
	if (event.key !== "Escape") return;
	if (!document.body.classList.contains("nav-open")) return;
	closeNav();
	document.querySelector<HTMLElement>("[data-menu-toggle]")?.focus();
});
