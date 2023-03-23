import {
	TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button,
} from '@mui/material';
import { FunctionComponent } from 'react';
import { useProducts } from '../../data/products.swr';

interface Props {
	onBuy: (id: number) => void;
}

export const TableProductsToBuy: FunctionComponent<Props> = ({ onBuy }) => {
	const { data: products } = useProducts();

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell align="right">Price</TableCell>
						<TableCell align="right">Amount available</TableCell>
						<TableCell align="right"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{products && products.map((product) => (
						<TableRow
							key={product.id}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row">{product.productName}</TableCell>
							<TableCell align="right">${product.cost}</TableCell>
							<TableCell align="right">{product.amountAvailable}</TableCell>
							<TableCell align="right">
								<Button
									onClick={() => onBuy(product.id)}
									variant="contained"
								>
									Buy
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
