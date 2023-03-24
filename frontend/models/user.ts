export type Role = 'seller' | 'buyer';
export type Coin = 5 | 10 | 20 | 50 | 100;

export interface User {
	id: number;
	username: string;
	password: string;
	deposit: number;
	role: Role;
}

export interface UserCreatePayload {
	username: string;
	role: Role;
	password: string;
	passwordCheck: string;
}

export type UserUpdatePayload = Partial<UserCreatePayload>;

export interface DepositPayload {
	deposit: Coin;
}

export interface BuyPayload {
	productId: number;
	amount: number;
}

export interface BuyResponse {
	totalSpent: number;
	productsBought: number;
	remainingChange: Coin[];
}
