export interface CreateProductPayload {
	amountAvailable: number;
	cost: number;
	productName: string;
}

export interface Product {
	id: number;
	amountAvailable: number;
	cost: number;
	productName: string;
	sellerId: number;
}
