const create = (tag, classname=null, content=null) => {
    const elm = document.createElement(tag);
    if(classname) elm.className = classname;
    if(content) elm.innerHTML = content;
    return elm;
}
HTMLElement.prototype.create = function(tag, classname=null, content=null) {
    const elm = create(tag, classname, content);
    this.append(elm);
    return elm;
}

const rnd = (min=0, max=1) => Math.random() * (max - min) + min;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));


const Aquarium = {
	colors:  ['yellow', 'blue', 'pink', 'green'],
	bubbles: 30,
	fishes:  12,
	blur: false,


	init: function() {
		if((new URLSearchParams(window.location.search))?.get('blur') !== null) this.blur = true;
		if(this.blur) document.body.style.setProperty('--blur', '0.32vmin');
		const bubblefield = document.body.create('div', 'bubble-field');

		const bubbles = Promise.all([...Array(this.bubbles).keys()].map(async i => {
			const duration = 3 + (0.5 * (Math.floor(Math.random() * 20) + 1));
			const delay        = (0 - (Math.random() * duration)).toFixed(2);
			const bubble = create('div');
			bubble.create('div');
			bubble.style.animationDelay = `${delay}s`;
			bubble.style.animationDuration = `${duration}s`;
			return bubble;
		}));
		
		const fishes = Promise.all([...Array(this.fishes).keys()].map(async i => {
			const color = this.colors[Math.floor(Math.random() * 4)]
			const fish  = create('div', `fish ${color}`);
			const blur = 0.3 - (i / this.fishes * 0.3);
			const size = i + 16;
			fish.style.setProperty(`--size`, `${size}vmin`);
			if(this.blur) fish.style.setProperty(`filter`, `blur(${blur}vmin)`);
			fish.create('div', 'top-fin');
			fish.create('div', 'fish-body');
			fish.create('div', 'tail-fin');
			fish.create('div', 'side-fin');
			fish.create('div', 'scale scale-1');
			fish.create('div', 'scale scale-2');
			fish.create('div', 'scale scale-3');
			fish.style.top = (Math.floor(Math.random() * 65) + 25).toFixed(2) + 'vh';
			this.shuffle(fish, true);
			return fish;
		}));

		return new Promise(res => Promise.all([
			new Promise(async res => res(bubblefield.append(...(await bubbles)))),
			new Promise(async res => res(document.body.append(...(await fishes))))
		]).then(() => res(this)));
	},


	shuffle: async function(fish, isDelay = false) {
		const duration  = (Math.random() * 20) + 20.0;
		const delay     = (0 - (Math.random() * duration)).toFixed(2);
		const bezier    = this.randomCubicBezier({ style: 'any', yMin: 0.15, yMax: 0.65 }).css;

		fish.animate(
			[
				{ offset: 0.00,  transform: `translate(var(--size))` },
				{ offset: 0.10,  transform: `translate(40vw, -12.5vh)` },
				{ offset: 0.20,  transform: `translate(50vw, -4.5vh) rotateZ(22deg)` },
				{ offset: 0.30,  transform: `translate(60vw, -25vh)` },
				{ offset: 0.40,  transform: `translate(80vw, -8vh) rotateZ(22deg)` },
				{ offset: 0.50,  transform: `translate(100vw, -14.5vh)` },
				{ offset: 0.51,  transform: `translate(100vw, -14.5vh) rotateY(180deg)` },
				{ offset: 0.60,  transform: `translate(80vw, -8vh) rotateY(180deg) rotateZ(22deg)` },
				{ offset: 0.70,  transform: `translate(60vw, -25vh) rotateY(180deg)` },
				{ offset: 0.80,  transform: `translate(50vw, -4.5vh) rotateY(180deg) rotateZ(22deg)` },
				{ offset: 0.90,  transform: `translate(40vw, -12.5vh) rotateY(180deg)` },
				{ offset: 0.99,  transform: `translate(var(--size)) rotateY(180deg) rotateZ(22deg)` },
				{ offset: 1.00,  transform: `translate(var(--size))` }
			],
			{
				duration: (duration * 1000),
				delay: isDelay ? delay * 1000 : 0,
				iterations: 1,
				easing: bezier,
				fill: "forwards",
				direction: 'normal',

			}
		).finished.then(() => this.shuffle(fish));
	},


	randomCubicBezier: (opts = {}) => {
		const {
			style = 'any', // style: 'any' | 'in' | 'out' | 'inOut' | 'overshoot'
			yMin = null,
			yMax = null
		} = opts;

		let x1, y1, x2, y2;

		switch (style) {
			case 'in':       // ease-in (lent -> rapide)
				x1 = rnd(0.05, 0.45); y1 = rnd(0.0, 0.9);
				x2 = rnd(0.30, 0.90); y2 = rnd(0.8, 1.2);
				break;

			case 'out':      // ease-out (rapide -> lent)
				x1 = rnd(0.10, 0.70); y1 = rnd(0.0, 0.3);
				x2 = rnd(0.55, 0.95); y2 = rnd(0.0, 1.0);
				break;

			case 'inOut':    // S-curve
				x1 = rnd(0.15, 0.45); y1 = rnd(0.0, 0.8);
				x2 = rnd(0.55, 0.85); y2 = rnd(0.2, 1.0);
				break;

			case 'overshoot': // dépassement (y peut sortir de [0,1])
				x1 = rnd(0.10, 0.50); y1 = rnd(-0.4, 0.8);
				x2 = rnd(0.50, 0.90); y2 = rnd(1.1, 1.8);
				break;

			default: // 'any'
				x1 = rnd(0, 1); y1 = rnd(-0.5, 1.5);
				x2 = rnd(0, 1); y2 = rnd(-0.5, 1.5);
		}

		// Optionnel: contraindre y si demandé
		if (yMin !== null) { y1 = Math.max(y1, yMin); y2 = Math.max(y2, yMin); }
		if (yMax !== null) { y1 = Math.min(y1, yMax); y2 = Math.min(y2, yMax); }

		// Assure des nombres courts
		const f = n => Number(n.toFixed(3));
		const bez = { x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2) };
		return { ...bez, css: `cubic-bezier(${bez.x1}, ${bez.y1}, ${bez.x2}, ${bez.y2})` };
	}

}.init();