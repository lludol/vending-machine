const ACCEPTED_COINS = [100, 50, 20, 10, 5] as const;
const SMALLEST_COIN = Math.min(...ACCEPTED_COINS);

// eslint-disable-next-line import/prefer-default-export
export const convertChangeToCoins = (cents: number): number[] => {
	const change: number[] = [];
	let deposit: number = cents;

	while (deposit >= SMALLEST_COIN) {
		for (let i = 0; i < ACCEPTED_COINS.length; ++i) {
			if (ACCEPTED_COINS[i]) {
				if (deposit >= ACCEPTED_COINS[i]) {
					change.push(ACCEPTED_COINS[i]);
					deposit -= ACCEPTED_COINS[i];
					break;
				}
			}
		}
	}

	return change;
};
